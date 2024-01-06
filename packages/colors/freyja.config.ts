import {defineConfig} from "@rednight/freyja";
import {resolve} from "path";

export default defineConfig({
  buttons: [
    "primary",
    "secondary",
    "danger",
    "warning",
    "info",
    "success",
    "norm",
    "weak",
  ],
  themes: [
    {
      output: resolve(__dirname, "dist/snow.theme.css"),
      files: [
        {
          path: "./lib/snow/standard-base.css",
          type: "light",
        },
      ],
    },
    {
      output: resolve(__dirname, "dist/carbon.theme.css"),
      files: [
        {
          path: "./lib/carbon/standard-base.css",
          type: "dark",
        },
      ],
    },
  ]
});
