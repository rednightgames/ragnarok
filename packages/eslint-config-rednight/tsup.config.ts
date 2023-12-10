import {defineConfig} from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  external: ["eslint"],
  splitting: false,
  treeshake: true,
  format: ["esm"],
  minify: true,
  clean: true,
  dts: true,
});
