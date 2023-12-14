export enum Code {
  UNNAMED = 0,
  EXCEPTION = 1
}

export const stringifyMessageName = (code: Code | number): string => {
  return `FR${code.toString(10).padStart(4, "0")}`;
};
