import {writeFileSync} from "fs";

import {ConfigProvider} from "./config";
import {Logger} from "./logger";
import {Resolution} from "./resolution";
import {Transform} from "./transform";

export class Cli {
  static async build() {
    const logger = await Logger.start({
      includeVersion: true,
      stdout: process.stdout,
    }, async logger => {
      const config = await ConfigProvider.load({logger});
      const sources = await Resolution.resolution({logger, config});
      const transformed = await Transform.transform({config, logger, sources});

      //TODO Move this into a separate class/method
      transformed.forEach(({promise, dist}) => {
        promise.then((res) => {
          writeFileSync(dist, res);
        }).catch((reason) => {
          logger.reportException(reason);
        });
      });
    });

    return logger.exitCode();
  }
}
