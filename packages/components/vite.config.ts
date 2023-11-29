import {resolve} from "node:path";

import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      outDir: ["dist"],
      exclude: ["vite.config.ts", "vitest.config.ts", "**/tests/**"],
      rollupTypes: true,
      clearPureImport: true,
    }),
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: false,
              minify: true,
              pure: true,
            },
          ],
        ],
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "rednight-components",
      formats: ["es", "cjs"],
    },
    minify: "esbuild",
    rollupOptions: {
      external: [
        "react",
        "react-is",
        "react-dom",
        "react-router",
        "react-hook-form",
        "react-router-dom",
        "styled-components",
        "react/jsx-runtime",
        "@remix-run/router",
      ],
    },
  },
});
