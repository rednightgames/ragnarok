/* eslint-disable ts/no-floating-promises */
import {runExit} from "./lib";

runExit(process.argv.slice(2), {
  cwd: process.cwd(),
});
