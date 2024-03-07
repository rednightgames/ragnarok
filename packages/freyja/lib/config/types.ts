import {Logger} from "../logger";
import {defineConfig} from "./config";

export interface ConfigOptions {
  logger: Logger;
}

export interface BundleConfig {
  dependencies: string[];
  mod: any;
}

export interface LoadConfig {
  path?: string;
  data?: ReturnType<typeof defineConfig>;
}
