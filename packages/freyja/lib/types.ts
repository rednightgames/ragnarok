import {Logger} from "./logger";

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
  source: string;
  type: ThemeType;
}

export type Sources = Map<string, Source[]>;

export interface TransformedSource {
  promise: Promise<string>;
  dist: string;
}

export interface StepOptions {
  logger: Logger;
  config: Config;
}
