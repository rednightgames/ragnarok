import {ConfigProvider} from "./config";
import {FilesProvider} from "./file";
import {Logger} from "./logger";
import {Transform} from "./transform";

export class Cli {
  static async build() {
    const logger = await Logger.start({
      includeVersion: true,
      stdout: process.stdout,
    }, async logger => {
      const config = await ConfigProvider.load({logger});
      const sources = await FilesProvider.resolution({logger, config});
      const transformed = await Transform.transform({config, sources});
      await FilesProvider.write({logger, config, transformed});
    });

    return logger.exitCode();
  }
}
