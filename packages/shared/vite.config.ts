import {resolve} from "path";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  define: {
    PUBLIC_PATH: JSON.stringify("/"),
  },
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
      name: "rednight-shared",
      formats: ["es"],
    },
    minify: "esbuild",
    rollupOptions: {
      external: ["@rednight/crypto", "@rednight/utils"],
    },
  },
});
