import {exec} from "child_process";
import {Command} from "clipanion";
import {existsSync} from "fs";
import {promisify} from "util";

import {allSettledSafe} from "../helpers";
import {Logger, MessageName} from "../logger";
import {BaseCommand} from "./base";

const execAsync = promisify(exec);

export default class ExtractCommand extends BaseCommand {
  static paths = [[`extract`], Command.Default];

  static usage = Command.Usage({
    description: "extract all translations from the projet",
    examples: [
      [
        `Extract all translations from package and all dependencies`,
        `$0 extract`,
      ],
    ],
  });

  async execute(): Promise<number | void> {
    const logger = await Logger.start(
      {
        stdout: this.context.stdout,
        includeVersion: true,
      },
      async (logger) => {
        await this.extract({logger});
      },
    );

    return logger.exitCode();
  }

  async extract(opts: {logger: Logger}) {
    let sourcemapperBinary: string | undefined;
    let dist: string;

    const getSourceMapper = async () => {
      const platform = process.platform;
      const cpuArch = process.arch;

      const sourcemapperPath = "/tmp/sourcemapper";
      if (!existsSync(sourcemapperPath)) {
        opts.logger.reportInfo(
          MessageName.UNNAMED,
          "Cloning https://github.com/dhoko/sourcemapper.git",
        );
        await execAsync(
          `git clone --quiet --single-branch --depth 1 https://github.com/dhoko/sourcemapper.git ${sourcemapperPath}`,
        );
      } else {
        opts.logger.reportInfo(
          MessageName.UNNAMED,
          "Using cached sourcemapper",
        );
      }

      if (platform === "darwin") {
        if (cpuArch === "arm") {
          return "/tmp/sourcemapper/bin/isourcemapper-arm";
        }
        return "/tmp/sourcemapper/bin/isourcemapper";
      }
      if (platform === "win32") {
        opts.logger.reportError(
          MessageName.ERROR,
          "Windows platform is not supported",
        );
      } else {
        return "/tmp/sourcemapper/bin/sourcemapper";
      }
    };

    const getDistDirectory = async () => {
      // inside the CI we have the dist directory available
      if (process.env.GITHUB_REF_NAME && existsSync("dist")) {
        return "dist";
      }

      if (existsSync("dist")) {
        opts.logger.reportInfo(
          MessageName.UNNAMED,
          "Extracting from local dist bundle",
        );
        return "dist";
      }

      // Cache for the CI so we're faster
      if (existsSync("webapp-bundle.tar.gz")) {
        opts.logger.reportInfo(MessageName.UNNAMED, "Extracting the bundle");
        await execAsync("rm -rf dist || true");
        await execAsync("mkdir dist");
        await execAsync("tar xzf webapp-bundle.tar.gz -C dist");
        return "dist";
      }
      opts.logger.reportInfo(MessageName.UNNAMED, "Creating the bundle");
      await execAsync("yarn run build");
      return "dist";
    };

    const packingBundle = async () => {
      await opts.logger.startProgressAsync(
        Logger.progressViaTitle(),
        async (progress) => {
          const getFileList = async (dist: string): Promise<string[]> => {
            const fileList = await execAsync(
              `find ${dist}/* -type f -name "*.map"`,
            );
            return fileList.stdout.trim().split("\n");
          };
          const getBundle = async (file: string) => {
            progress.setTitle(file);
            await execAsync(
              `${sourcemapperBinary} --input ${file} --output 'i18n-js'`,
            );
          };

          const queue: Promise<unknown>[] = [];

          let files = await getFileList(dist);

          for (const file of files) {
            queue.push(Promise.resolve().then(() => getBundle(file)));
          }

          while (queue.length > 0) {
            const copy = [...queue];
            queue.length = 0;
            await allSettledSafe(copy);
          }
        },
      );
    };

    const linkingTemplate = async () => {
      await execAsync(
        `cd i18n-js && ../../../node_modules/.bin/ttag extract . -o "../template.pot"`,
      );
      await execAsync(`rm -rf "./i18n-js"`);
    };

    await opts.logger.startTimerAsync(
      "Getting SourceMapper step",
      {
        skipIfEmpty: false,
      },
      async () => {
        sourcemapperBinary = await getSourceMapper();
      },
    );

    if (!sourcemapperBinary) {
      return;
    }

    await opts.logger.startTimerAsync(
      "Bandling step",
      {
        skipIfEmpty: false,
      },
      async () => {
        dist = await getDistDirectory();
      },
    );

    await opts.logger.startTimerAsync(
      "Packing step",
      {
        skipIfEmpty: false,
      },
      async () => {
        await packingBundle();
      },
    );

    await opts.logger.startTimerAsync(
      "Link step",
      {
        skipIfEmpty: false,
      },
      async () => {
        await linkingTemplate();
      },
    );
  }
}
