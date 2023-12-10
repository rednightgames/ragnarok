import {APP_NAMES} from "../constants";

export interface RednightConfig {
  CLIENT_SECRET: string;
  APP_VERSION: string;
  APP_NAME: APP_NAMES;
  API_URL: string;
  LOCALES: Record<string, string>;
  DATE_VERSION: string;
  COMMIT: string;
  BRANCH: string;
  VERSION_PATH: string;
}
