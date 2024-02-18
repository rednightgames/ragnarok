import {Cli} from "./cli";
import {Logger, MessageName} from './logger';

Logger.start({
  includeVersion: true,
  stdout: process.stdout,
}, async (report) => {
  await new Cli(process.argv).run().catch((e) => report.reportError(MessageName.ERROR, e));
});
