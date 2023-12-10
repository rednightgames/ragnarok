export type ThemeFileType = "light" | "dark";

export interface FileConfig {
  path: string;
  type: ThemeFileType;
}

export interface ThemeConfig {
  output: string;
  files: FileConfig[];
}
