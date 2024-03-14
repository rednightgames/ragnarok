import {config} from "@protontech/openpgp/lightweight";

export const setConfig = () => {
  config.s2kIterationCountByte = 255;
  config.rejectPublicKeyAlgorithms = new Set();
  config.rejectCurves = new Set();
  config.minRSABits = 1023;
  config.checkEdDSAFaultySignatures = false;
};

export * from "@protontech/openpgp/lightweight";
