export const ARGON2_PARAMS = {
  RECOMMENDED: {passes: 1, parallelism: 4, memoryExponent: 19, tagLength: 32},
  MINIMUM: {passes: 3, parallelism: 4, memoryExponent: 16, tagLength: 32},
};
