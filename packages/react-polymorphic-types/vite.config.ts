import {resolve} from "node:path";

import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      outDir: ["dist"],
      exclude: ["vite.config.ts"],
      rollupTypes: true,
      clearPureImport: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "react-polymorphic-types",
      formats: ["es"],
    },
    minify: "esbuild",
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime"
      ],
    },
  },
  resolve: {
  },
});
