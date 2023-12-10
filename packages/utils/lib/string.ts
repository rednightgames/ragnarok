export const stripLeadingAndTrailingSlash = (str_: string) => {
  return str_.replaceAll(/^\/+|\/+$/g, "");
};
