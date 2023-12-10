import {pluginStylistic} from "../plugins";
import {ConfigItem} from "../types";

export const stylistic = (): ConfigItem[] => {
  return [
    {
      name: "rednight:stylistic",
      plugins: {
        "style": pluginStylistic,
      },
      rules: {
        "style/arrow-spacing": ["error", {after: true, before: true}],
        "style/block-spacing": ["error", "never"],
        "style/brace-style": ["error", "1tbs", {allowSingleLine: false}],
        "style/comma-dangle": ["error", "always-multiline"],
        "style/comma-spacing": ["error", {after: true, before: false}],
        "style/comma-style": ["error", "last"],
        "style/computed-property-spacing": ["error", "never", {enforceForClassMembers: true}],
        "style/dot-location": ["error", "property"],
        "style/eol-last": "error",
        "style/no-tabs": "error",
        "style/quotes": ["error", "double", {allowTemplateLiterals: true, avoidEscape: false}],
        "style/jsx-closing-bracket-location": "error",
        "style/jsx-closing-tag-location": "error",
        "style/jsx-curly-brace-presence": ["error", {propElementValues: "always"}],
        "style/jsx-curly-newline": "error",
        "style/jsx-curly-spacing": ["error", "never"],
        "style/jsx-equals-spacing": "error",
        "style/jsx-first-prop-new-line": "error",
        "style/jsx-indent": ["error", 2, {checkAttributes: true, indentLogicalExpressions: true}],
        "style/jsx-indent-props": ["error", 2],
        "style/jsx-max-props-per-line": ["error", {maximum: 1, when: "multiline"}],
        "style/jsx-one-expression-per-line": ["error", {allow: "single-child"}],
        "style/jsx-quotes": "error",
        "style/jsx-tag-spacing": [
          "error",
          {
            afterOpening: "never",
            beforeClosing: "never",
            beforeSelfClosing: "always",
            closingSlash: "never",
          },
        ],
        "style/jsx-wrap-multilines": [
          "error",
          {
            arrow: "parens-new-line",
            assignment: "parens-new-line",
            condition: "parens-new-line",
            declaration: "parens-new-line",
            logical: "parens-new-line",
            prop: "parens-new-line",
            return: "parens-new-line",
          },
        ],
      },
    },
  ];
};
