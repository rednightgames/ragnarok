import {GLOB_SRC} from "../globs";
import {parserTs, pluginTs} from "../plugins";
import {
  ConfigItem,
  OptionsComponentExts,
  OptionsOverrides,
  OptionsTypeScriptParserOptions,
} from "../types";

export const typescript = (
  options?: OptionsComponentExts &
    OptionsOverrides &
    OptionsTypeScriptParserOptions,
): ConfigItem[] => {
  const {componentExts = [], parserOptions = {}} = options ?? {};

  return [
    {
      name: "rednight:typescript",
      plugins: {
        ts: pluginTs as any,
      },
    },
    {
      files: [GLOB_SRC],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          project: "./tsconfig.json",
          tsconfigRootDir: process.cwd(),
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: "module",
          ...(parserOptions as any),
        },
      },
      rules: {
        "ts/brace-style": ["error", "1tbs", {allowSingleLine: true}],
        "ts/dot-notation": ["error", {allowKeywords: true}],
        "ts/func-call-spacing": ["error", "never"],
        "ts/keyword-spacing": [
          "error",
          {
            before: true,
            after: true,
            overrides: {
              return: {after: true},
              throw: {after: true},
              case: {after: true},
            },
          },
        ],
        "ts/no-dupe-class-members": "error",
        "ts/no-extra-parens": [
          "off",
          "all",
          {
            conditionalAssign: true,
            nestedBinaryExpressions: false,
            returnAssign: false,
            ignoreJSX: "all", // delegate to eslint-plugin-react
            enforceForArrowConditionals: false,
          },
        ],
        "ts/no-empty-function": [
          "error",
          {
            allow: ["arrowFunctions", "functions", "methods"],
          },
        ],
        "ts/no-extra-semi": "error",
        "ts/no-implied-eval": "error",
        "ts/no-loss-of-precision": "error",
        "ts/no-loop-func": "error",
        "ts/no-magic-numbers": [
          "off",
          {
            ignore: [],
            ignoreArrayIndexes: true,
            enforceConst: true,
            detectObjects: false,
          },
        ],
        "ts/no-redeclare": ["error"],
        "ts/no-shadow": "off",
        "ts/space-before-blocks": "error",
        "ts/no-throw-literal": "error",
        "ts/no-unused-expressions": [
          "error",
          {
            allowShortCircuit: false,
            allowTernary: false,
            allowTaggedTemplates: false,
          },
        ],
        "ts/no-unused-vars": [
          "error",
          {vars: "all", args: "after-used", ignoreRestSiblings: true},
        ],
        "ts/no-use-before-define": [
          "error",
          {functions: true, classes: true, variables: true},
        ],
        "ts/no-useless-constructor": "error",
        "ts/quotes": [
          "error",
          "double",
          {
            avoidEscape: true,
            allowTemplateLiterals: true,
          },
        ],
        "ts/semi": ["error", "always"],
        "ts/space-before-function-paren": [
          "error",
          {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
          },
        ],
        "ts/require-await": "off",
        "ts/return-await": ["error", "in-try-catch"],
        "ts/space-infix-ops": "error",
        "ts/object-curly-spacing": ["error", "never"],
        "ts/array-type": ["error", {default: "array"}],
        "ts/comma-dangle": [
          "error",
          {
            arrays: "only-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "always-multiline",
            generics: "ignore",
            enums: "only-multiline",
            tuples: "only-multiline",
          },
        ],
        "ts/default-param-last": "off",
        "ts/explicit-function-return-type": "off",
        "ts/indent": "off",
        "ts/naming-convention": [
          "error",
          {
            selector: "variable",
            format: ["camelCase", "PascalCase", "UPPER_CASE", "snake_case"],
          },
          {
            selector: "function",
            format: ["camelCase", "PascalCase"],
          },
          {
            selector: "typeLike",
            format: ["PascalCase", "UPPER_CASE"],
          },
          {
            selector: "enum",
            format: ["PascalCase", "UPPER_CASE"],
          },
        ],
        "ts/no-explicit-any": "off",
        "ts/prefer-for-of": "off",
        "ts/no-floating-promises": "warn",
        "ts/no-for-in-array": "error",
        "ts/no-misused-promises": ["error", {checksVoidReturn: false}],
        "ts/lines-between-class-members": [
          "error",
          "always",
          {exceptAfterSingleLine: true},
        ],
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "constructor-super": "off",
        "getter-return": "off",
        "no-const-assign": "off",
        "no-dupe-args": "off",
        "no-dupe-class-members": "off",
        "no-dupe-keys": "off",
        "no-func-assign": "off",
        "no-import-assign": "off",
        "no-new-symbol": "off",
        "no-obj-calls": "off",
        "no-redeclare": "off",
        "no-setter-return": "off",
        "no-this-before-super": "off",
        "no-undef": "off",
        "no-unreachable": "off",
        "no-unsafe-negation": "off",
        "valid-typeof": "off",
        "import/named": "off",
        "import/no-named-as-default-member": "off",
        "import/no-unresolved": "off",
      },
    },
  ];
};
