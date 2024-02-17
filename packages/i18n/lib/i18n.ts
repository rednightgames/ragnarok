import {Cli} from "./cli";
import {Logger} from './logger';

Logger.start({
  includeVersion: true,
  stdout: process.stdout,
}, async (logger) => {
  new Cli(process.argv).run().catch(logger.reportException);
});
