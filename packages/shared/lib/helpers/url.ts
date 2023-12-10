// Note: This function makes some heavy assumptions on the hostname. Only intended to work on proton-domains.
export const getSecondLevelDomain = (hostname: string) => {
  return hostname.slice(hostname.indexOf(".") + 1);
};
