import {parse} from "node:path";

import {bundleRequire} from "bundle-require";
import JoyCon from "joycon";

import {CONFIG_FILES} from "../constants";
import {Code} from "../logger";
import {Config, MaybePromise} from "../types";
import {BundleConfig, ConfigOptions, LoadConfig} from "./types";

export const defineConfig = (
  options:
    | Config
    | (() => MaybePromise<Config>),
) => options;

export class ConfigProvider {
  static async load(opts: ConfigOptions) {
    return opts.logger.startTimerPromise("Config step", async () => {
      const config = await this.loadConfig(process.cwd());

      if (!config.path) {
        opts.logger.reportError(Code.EXCEPTION, "Cannot find config file");
      }

      return typeof config.data === "function"
        ? config.data()
        : config.data as Config;
    });
  }

  private static async bundleConfig(configPath: string): Promise<BundleConfig> {
    return bundleRequire({
      filepath: configPath,
    });
  }

  private static async resolveConfig(cwd: string = process.cwd()): Promise<string | null> {
    const configJoycon = new JoyCon();
    return configJoycon.resolve({
      files: CONFIG_FILES,
      cwd: cwd,
      stopDir: parse(cwd).root,
    });
  }

  private static async loadConfig(cwd: string): Promise<LoadConfig> {
    const configPath = await this.resolveConfig(cwd);

    if (configPath) {
      const config = await this.bundleConfig(configPath);

      return {
        path: configPath,
        data: config.mod.default || config.mod,
      };
    }

    return {};
  }
}
