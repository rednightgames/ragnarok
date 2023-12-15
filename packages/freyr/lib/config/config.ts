export type MaybePromise<T> = T | Promise<T>;

export type ThemeFileType = "light" | "dark";

export interface FileConfig {
  path: string;
  type: ThemeFileType;
}

export interface ThemeConfig {
  output: string;
  files: FileConfig[];
}

/**
 * The options available in freyr.config.ts
 */
export type Config = {
  buttons?: string[];
  themes?: ThemeConfig[];
};

export const defineConfig = (
  options:
    | Config
    | (() => MaybePromise<Config>),
) => options;
