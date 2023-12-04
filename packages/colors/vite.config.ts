import {resolve} from "path";
import {defineConfig} from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "rednight-colors",
      formats: ["es", "cjs"],
    },
    minify: "esbuild",
    rollupOptions: {
      external: [],
    },
  },
});
