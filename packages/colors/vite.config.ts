import react from "@vitejs/plugin-react";
import {resolve} from "path";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components", {
              displayName: false,
              minify: true,
              pure: true,
            },
          ],
        ],
      },
    }),
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
      name: "rednight-colors",
      formats: ["es", "cjs"],
    },
    minify: "esbuild",
    rollupOptions: {
      external: [
        "react",
        "react-is",
        "styled-components"
      ],
    },
  },
});
