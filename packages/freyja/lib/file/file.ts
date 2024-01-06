import {existsSync, mkdirSync, readFileSync, writeFileSync} from "fs";

import {Logger, MessageName} from "../logger";
import {Config, FileConfig, Source, StepOptions, TransformedSource} from "../types";
import {stripFilename} from "./helpers";

export interface WriteOptions extends StepOptions {
  transformed: TransformedSource[];
}

export class FilesProvider {
  static async resolution({logger, config}: StepOptions) {
    let file_provider = new FilesProvider({config, logger});
    return file_provider.logger.startTimerPromise("Resolution step", async () => {
      file_provider.getOutputDirs();

      return file_provider.loadThemes();
    });
  }

  static async write({logger, config, transformed}: WriteOptions) {
    let file_provider = new FilesProvider({config, logger});
    return file_provider.logger.startTimerPromise("Save themes step", async () => {
      return file_provider.writeTransformed(transformed);
    });
  }

  private readonly config: Config;
  private readonly logger: Logger;

  constructor({config, logger}: StepOptions) {
    this.config = config;
    this.logger = logger;
  }

  private writeTransformed(transformed: TransformedSource[]) {
    transformed.forEach(({promise, dist}) => {
      promise.then((res) => {
        writeFileSync(dist, res);
      }).catch((reason) => {
        this.logger.reportException(reason);
      });
    });
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
