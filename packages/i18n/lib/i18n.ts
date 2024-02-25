import {runExit} from "./lib";

runExit(process.argv.slice(2), {
  cwd: process.cwd(),
});
