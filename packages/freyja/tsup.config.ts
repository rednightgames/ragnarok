import {defineConfig} from "tsup";

export default defineConfig({
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
});
