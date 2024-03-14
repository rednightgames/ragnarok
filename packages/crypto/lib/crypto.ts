import {setConfig} from "./openpgp";

export const init = () => {
  setConfig();
};

export {argon2} from "./crypto/argon2";
export {SHA256, SHA512, unsafeMD5} from "./crypto/hash";
