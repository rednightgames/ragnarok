import {readFileSync, existsSync, mkdirSync} from "fs";

import {Logger, MessageName} from "../logger";
import {Config, FileConfig, Source, StepOptions} from "../types";
import {stripFilename} from "./helpers";

export class Resolution {
  static async resolution({logger, config}: StepOptions) {
    let resolution = new Resolution({config, logger});
    return resolution.logger.startTimerPromise("Resolution step", async () => {
      resolution.getOutputDirs();

      return resolution.loadThemes();
    });
  }

  private readonly config: Config;
  private readonly logger: Logger;

  constructor({config, logger}: StepOptions) {
    this.config = config;
    this.logger = logger;
  }

  private getOutputDirs() {
    this.config.themes?.forEach((value) => {
      const dir_name = stripFilename(value.output);
      if (!existsSync(dir_name)) {
        mkdirSync(dir_name, {recursive: true});
      }
    });
  }

  private loadFiles(files: FileConfig[]) {
    let sources: Source[] = [];

    files.map(({path, type}) => {
      let source = "";

      try {
        source = readFileSync(path, {encoding: "utf-8"});
      } catch (e) {
        this.logger.reportError(MessageName.EXCEPTION, `no such file, open ${path}`);
      }

      sources.push({
        source,
        type,
      });
    });

    return sources;
  }

  private async loadThemes() {
    const result = new Map<string, Source[]>();

    this.config.themes?.forEach((theme) => {
      let data = this.loadFiles(theme.files);

      result.set(theme.output, data);
    });

    return result;
  }
}
