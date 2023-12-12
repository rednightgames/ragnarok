export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 4 * WEEK;
export const YEAR = 12 * MONTH;
export const MINUTE_IN_SECONDS = 60;
export const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
export const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;

export const EMAIL_PLACEHOLDER = "john@example.com";
export const USERNAME_PLACEHOLDER = "john";

export const BRAND_NAME = "Rednight";
export const TEAM_NAME = `${BRAND_NAME} team`;

export const APPS = {
  LANDING: "@rednight/landing",
  ACCOUNT: "@rednight/account",
} as const;

interface AppConfiguration {
  publicPath: string;
  subdomain: string;
  name: string;
  bareName: string;
  clientID: string;
  icon: string;
  settingsSlug: string;
}

export const APPS_CONFIGURATION: {[key in APP_NAMES]: AppConfiguration} = {
  [APPS.ACCOUNT]: {
    publicPath: "",
    subdomain: "",
    name: `${BRAND_NAME} Account`,
    bareName: "Account",
    clientID: "web-account",
    icon: "brand-rednight",
    settingsSlug: "account",
  },
  [APPS.LANDING]: {
    publicPath: "",
    subdomain: "",
    name: `${BRAND_NAME}`,
    bareName: "Landing",
    clientID: "landing",
    icon: "brand-rednight",
    settingsSlug: "account",
  },
};

export type APP_KEYS = keyof typeof APPS;
export type APP_NAMES = (typeof APPS)[APP_KEYS];
export const SSO_PATHS = {
  SWITCH: "/switch",
  LOGIN: "/login",
  RESET_PASSWORD: "/reset-password",
  SIGNUP: "/signup",
} as const;

export enum HTTP_STATUS_CODE {
  OK = 200,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500
}

export const REGEX_EMAIL =
  /(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\da-z]+\.)+[a-z]{2,}))/i;

export const REDNIGHT_DOMAINS = ["https://rednightgames.com"];

export enum DESKTOP_PLATFORMS {
  LINUX = "linux",
  MACOS = "macos",
  WINDOWS = "windows"
}

export enum REDNIGHT_WEBSITES {
  STATUS_PAGE = "https://status.rednightgames.com"
}
