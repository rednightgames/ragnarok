import react from "@vitejs/plugin-react";
import {defineConfig, splitVendorChunkPlugin} from "vite";
import {createHtmlPlugin} from "vite-plugin-html";

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      createHtmlPlugin({
        minify: true,
        pages: [
          {
            entry: "src/app",
            filename: "index.html",
            template: "src/app.html",
            injectOptions: {
              data: {
                appName: "index",
              },
            },
          },
          {
            entry: "src/app",
            filename: "storage.html",
            template: "src/storage.html",
            injectOptions: {
              data: {
                appName: "index",
              },
            },
          }
        ]
      }),
    ],
    build: {
      rollupOptions: {
        external: [            
          "src/app"
        ],
      }
    },
    server: {
      host: "127.0.0.1",
      port: 8080,
    },
  };
});
