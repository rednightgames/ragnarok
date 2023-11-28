import {pluginSortKeys} from "../plugins";
import {ConfigItem} from "../types";

/**
 * Optional sort-keys plugin
 *
 * @see https://github.com/namnm/eslint-plugin-sort-keys
 */
export const sortKeys = (): ConfigItem[] => {
  return [
    {
      name: "rednight:sort-keys",
      plugins: {
        "sort-keys": pluginSortKeys,
      },
      rules: {
        "sort-keys/imports": "error",
        "sort-keys/exports": "error",
      },
    },
  ];
};
