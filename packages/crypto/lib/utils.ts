const ifDefined = <T, R>(cb: (input: T) => R) => {
  return <U extends T | undefined>(input: U) => {
    return (input !== undefined ? cb(input as T) : undefined) as U extends T ? R : undefined;
  };
};
export const encodeUtf8 = ifDefined((input: string) => encodeURIComponent(input));
export const decodeUtf8 = ifDefined((input: string) => decodeURIComponent(input));
export const encodeBase64 = ifDefined((input: string) => btoa(input).trim());
export const decodeBase64 = ifDefined((input: string) => atob(input.trim()));
export const encodeUtf8Base64 = ifDefined((input: string) => encodeBase64(encodeUtf8(input)));
export const decodeUtf8Base64 = ifDefined((input: string) => decodeUtf8(decodeBase64(input)));
