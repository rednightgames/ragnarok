import {isTruthy, stripLeadingAndTrailingSlash} from "@rednight/utils";

import {APP_NAMES, APPS, APPS_CONFIGURATION} from "../constants";

export const getAppHrefBundle = (to: string, toApp: APP_NAMES) => {
  const path = [APPS_CONFIGURATION[toApp].publicPath, to]
    .map((s) => stripLeadingAndTrailingSlash(s))
    .filter((s) => isTruthy(s))
    .join("/");
  return `/${path}`;
};

export const getAccountSettingsApp = () => APPS.ACCOUNT;

export const getClientID = (appName: APP_NAMES) => {
  return APPS_CONFIGURATION[appName].clientID;
};

export const getAppName = (appName: APP_NAMES) => {
  return APPS_CONFIGURATION[appName].name;
};

export const getAppShortName = (appName: APP_NAMES) => {
  return APPS_CONFIGURATION[appName].bareName;
};
