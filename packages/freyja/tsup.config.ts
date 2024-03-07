import {defineConfig} from "tsup";
import {readFileSync} from "fs";

export default defineConfig(() => {
  const {version} = JSON.parse(
    readFileSync(new URL("./package.json", import.meta.url)).toString(),
  );

  return {
    name: "freyja",
    bundle: true,
    entry: ["lib/freyja.ts"],
    splitting: false,
    treeshake: false,
    format: ["esm"],
    platform: "node",
    target: "node20",
    minify: "terser",
    clean: true,
    dts: {
      resolve: true,
    },
    define: {
      FREYJA_VERSION: JSON.stringify(version),
    },
  };
});
