export type ThemeFileType = "light" | "dark";

export interface FileConfig {
  path: string;
  type: ThemeFileType;
}

export interface ThemeConfig {
  output: string;
  files: FileConfig[];
}

const config: ThemeConfig[] = [
  {
    output: "./lib/themes/dist/snow.theme.css",
    files: [
      {
        path: "./lib/themes/src/snow/standard-base.css",
        type: "light",
      },
    ],
  },
  {
    output: "./lib/themes/dist/carbon.theme.css",
    files: [
      {
        path: "./lib/themes/src/carbon/standard-base.css",
        type: "dark",
      },
    ],
  },
];

export default config;
