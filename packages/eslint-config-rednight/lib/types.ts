// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck

import type {ParserOptions} from "@typescript-eslint/parser";
import type {FlatESLintConfigItem} from "eslint-define-config";

export type ConfigItem = Omit<FlatESLintConfigItem, "plugins"> & {
  /**
   * Custom name of each config item
   */
  name?: string;

  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;
};

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;
}

export interface OptionsOverrides {
  overrides?: ConfigItem["rules"];
}

export interface OptionsConfig extends OptionsComponentExts {
  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypeScriptParserOptions;

  /**
   * Enable React support.
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean;

  /**
   * Provide overrides for rules for each integration.
   */
  overrides?: {
    typescript?: ConfigItem["rules"];
  };
}
