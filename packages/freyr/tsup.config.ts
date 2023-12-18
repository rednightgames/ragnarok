import {defineConfig} from "tsup";

export default defineConfig({
  name: "freyr",
  bundle: true,
  entry: ["lib/freyr.ts"],
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
});
