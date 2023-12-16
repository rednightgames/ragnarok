export type MaybePromise<T> = T | Promise<T>;

export type ThemeType = "light" | "dark";

export interface FileConfig {
  path: string;
  type: ThemeType;
}

export interface ThemeConfig {
  output: string;
  files: FileConfig[];
}

export interface Config {
  buttons?: string[];
  themes?: ThemeConfig[];
}

export interface Source {
  dist: string;
  path: string;
  data: string;
  type: ThemeType;
}

export interface TransformedSource {
  dist: string;
  data: string;
  type: ThemeType;
}
