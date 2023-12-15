import {parse} from "node:path";

import {bundleRequire} from "bundle-require";
import JoyCon from "joycon";

import {CONFIG_FILES} from "../constants";
import {defineConfig} from "./config";

export const loadConfig = async (cwd: string): Promise<{path?: string; data?: ReturnType<typeof defineConfig>}> => {
  const configJoycon = new JoyCon();
  const configPath = await configJoycon.resolve({
    files: CONFIG_FILES,
    cwd: cwd,
    stopDir: parse(cwd).root,
  });

  if (configPath) {
    const config = await bundleRequire({
      filepath: configPath,
    });

    return {
      path: configPath,
      data: config.mod.default || config.mod,
    };
  }

  return {};
};
