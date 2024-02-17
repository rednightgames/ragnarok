import {readFileSync} from "fs";

const {version} = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url)).toString(),
);

export const EDDA_VERSION = version as string;
