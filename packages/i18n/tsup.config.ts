import {defineConfig} from "tsup";

export default defineConfig({
  name: "i18n",
  bundle: true,
  entry: ["lib/i18n.ts"],
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
