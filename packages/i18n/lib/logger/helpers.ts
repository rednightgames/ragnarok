import chalk, {Chalk, Options} from "chalk";
import CI from "ci-info";

import {MessageName} from "./messageNames";

export const stringifyMessageName = (code: MessageName | number): string => {
  return `ED${code.toString(10).padStart(4, "0")}`;
};

export const Type = {
  NO_HINT: "NO_HINT",
  ID: "ID",
  NULL: "NULL",
  NUMBER: "NUMBER",
  CODE: "CODE",
  DURATION: "DURATION",
} as const;

export type Types = keyof typeof Type;

export enum Style {
  BOLD = 1 << 1,
}

const chalkOptions = (() => {
  if (CI.GITHUB_ACTIONS) {
    return {level: 2};
  }
  if (chalk.level) {
    return {level: chalk.level};
  }
  return {level: 0};
})();

const chalkInstance = new Chalk(chalkOptions as Options);

const colors = new Map<Types, [string, number] | null>([
  [Type.NO_HINT, null],
  [Type.NULL, ["#a853b5", 129]],
  [Type.NUMBER, ["#ffd700", 220]],
  [Type.CODE, ["#87afff", 111]],
]);

export const applyColor = (
  value: string,
  formatType: Types | string,
): string => {
  const colorSpec = colors.get(formatType as Types);
  if (colorSpec === null) {
    return value;
  }

  const color = (() => {
    if (typeof colorSpec === "undefined") {
      return formatType;
    }
    if (chalkOptions.level >= 3) {
      return colorSpec[0];
    }
    return colorSpec[1];
  })();

  const fn = (() => {
    if (typeof color === "number") {
      return chalkInstance.ansi256(color);
    }
    if (color.startsWith("#")) {
      return chalkInstance.hex(color);
    }
    return (chalkInstance as any)[color];
  })();

  if (typeof fn !== "function") {
    throw new TypeError(`Invalid format type ${color}`);
  }

  return fn(value);
};

const validateTransform = <T>(spec: {
  pretty: (val: T) => string;
}): {pretty: (val: T) => string} => spec;

const transforms = {
  [Type.ID]: validateTransform({
    pretty: (value: number | string) => {
      if (typeof value === "number") {
        return applyColor(`${value}`, Type.NUMBER);
      }
      return applyColor(value, Type.CODE);
    },
  }),
  [Type.NUMBER]: validateTransform({
    pretty: (value: number) => applyColor(`${value}`, Type.NUMBER),
  }),
  [Type.DURATION]: validateTransform({
    pretty: (duration: number) => {
      const minutes = Math.floor(duration / 1000 / 60);
      const seconds = Math.ceil((duration - minutes * 60 * 1000) / 1000);
      return (minutes > 0 ? `${minutes}m ` : "") + `${seconds}s`;
    },
  }),
};

export const pretty = <T extends Types>(
  value: string | number,
  formatType: T | string,
): string => {
  if (value === null) {
    return applyColor("null", Type.NULL);
  }

  if (Object.hasOwn(transforms, formatType)) {
    const transform = transforms[formatType as keyof typeof transforms];
    const typedTransform = transform as Extract<
      typeof transform,
      {pretty: (val: Types) => any}
    >;
    return typedTransform.pretty(value);
  }

  return applyColor(value as string, formatType);
};

export const formatCode = (name: MessageName | null) => {
  const num = name === null ? 0 : name;
  const label = stringifyMessageName(num);
  return name === null ? applyColor(label, "grey") : label;
};

export const applyStyle = (text: string, flags: Style): string => {
  switch (flags) {
    case Style.BOLD:
      return chalkInstance.bold(text);
    default:
      return text;
  }
};

export const getLinePrefix = (index: number, count: number): string => {
  const isFirst = index === 0;
  const isLast = index === count - 1;

  if (isFirst && isLast) {
    return "";
  }

  if (isFirst) {
    return "┌ ";
  }

  if (isLast) {
    return "└ ";
  }

  return "│ ";
};

export const formatName = (name: MessageName | null) => {
  const num = name === null ? 0 : name;
  const label = stringifyMessageName(num);

  if (name === null) {
    return pretty(label, `grey`);
  }
  return label;
};
