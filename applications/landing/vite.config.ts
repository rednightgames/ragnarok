import react from "@vitejs/plugin-react";
import {createHtmlPlugin} from "vite-plugin-html";
import {defineConfig, splitVendorChunkPlugin} from "vite";
import {resolve} from "path";

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          entry: resolve(__dirname, "src/app/index.tsx"),
          template: "index.html",
          filename: "index.html",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/app/components"),
      "@containers": resolve(__dirname, "./src/app/containers"),
      "@pages": resolve(__dirname, "./src/pages"),
    },
  },
  build: {
    minify: "terser",
    sourcemap: "hidden",
  },
  server: {
    host: "127.0.0.1",
    port: 8080,
  },
});
