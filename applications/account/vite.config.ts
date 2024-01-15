import react from "@vitejs/plugin-react";
import {resolve} from "path";
import {defineConfig, splitVendorChunkPlugin} from "vite";

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],
  build: {
    minify: "terser",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        storage: resolve(__dirname, "storage.html"),
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 8080,
  },
});
