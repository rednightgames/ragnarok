import md5 from "./_md5";

export const SHA256 = async (data: Uint8Array) => {
  const digest = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(digest);
};

export const SHA512 = async (data: Uint8Array) => {
  const digest = await crypto.subtle.digest("SHA-512", data);
  return new Uint8Array(digest);
};

export const unsafeMD5 = (data: Uint8Array) => md5(data);
