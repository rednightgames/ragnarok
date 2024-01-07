import react from "@vitejs/plugin-react";
import {defineConfig, splitVendorChunkPlugin} from "vite";

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      splitVendorChunkPlugin(),
    ],
    server: {
      host: "127.0.0.1",
      port: 8080,
    },
  };
});
