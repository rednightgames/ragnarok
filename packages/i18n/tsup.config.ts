import {readFileSync} from "fs";
import {defineConfig} from "tsup";

export default defineConfig(() => {
  const {version} = JSON.parse(
    readFileSync(new URL("./package.json", import.meta.url)).toString(),
  );

  return {
    name: "i18n",
    bundle: true,
    entry: ["lib/i18n.ts"],
    splitting: false,
    treeshake: false,
    format: ["esm"],
    platform: "node",
    target: "node20",
    minify: false,
    clean: true,
    define: {
      EDDA_VERSION: JSON.stringify(version)
    }
  }
});
