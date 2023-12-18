import {defineConfig} from "@rednight/freyr";
import {resolve} from "path";

export default defineConfig({
  buttons: [
    "signal-primary",
    "signal-secondary",
    "signal-danger",
    "signal-warning",
    "signal-info",
    "signal-success",
    "interaction-norm",
    "interaction-weak",
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
