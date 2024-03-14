import {ARGON2_PARAMS} from "../constants";
import {Argon2S2K, Config, config as defaultConfig} from "../openpgp";

type Argon2Params = Config["s2kArgon2Params"] & {
  tagLength: number;
};

export interface Argon2Options {
  password: string;
  salt: Uint8Array;
  /** see https://www.rfc-editor.org/rfc/rfc9106.html#name-parameter-choice */
  params: Argon2Params;
}

export const argon2 = async ({
  password,
  salt,
  params = ARGON2_PARAMS.RECOMMENDED,
}: Argon2Options) => {
  const s2k = new Argon2S2K({...defaultConfig, s2kArgon2Params: params});
  s2k.salt = salt;
  return s2k.produceKey(password, params.tagLength);
};
