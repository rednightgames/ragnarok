import type {Preview} from "@storybook/react";
import {RednightConfig} from "@rednight/shared";
import {ConfigProvider} from "@containers/config";
import {FocusProvider} from "@containers/focus";
import {Icons} from "@components/Icon";

import "./index.scss";

const config: RednightConfig = {
  API_URL: "",
  APP_NAME: "@rednight/account",
  APP_VERSION: "",
  BRANCH: "",
  CLIENT_SECRET: "",
  COMMIT: "",
  DATE_VERSION: "",
  LOCALES: {},
  VERSION_PATH: "",
};

const preview: Preview = {
  decorators: [
    (Story) => (
      <ConfigProvider config={config}>
        <Icons />
        <FocusProvider>
          <Story />
        </FocusProvider>
      </ConfigProvider>
    ),
  ],
  parameters: {
    actions: {argTypesRegex: "^on[A-Z].*"},
  },
};

export default preview;
