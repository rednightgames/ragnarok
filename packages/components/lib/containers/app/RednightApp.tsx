import {Icons} from "@components/Icon";
import {RednightConfig} from "@rednight/shared";
import {ReactNode} from "react";
import {BrowserRouter} from "react-router-dom";

import {ConfigProvider} from "../config";
import {FocusProvider} from "../focus";
import {ThemeProvider} from "../theme";

interface AppProps {
  /**
   * Config of application config.
   */
  config: RednightConfig;
  /**
   * children of app.
   */
  children: ReactNode;
}

const RednightApp = ({config, children}: AppProps) => {
  return (
    <ConfigProvider config={config}>
      <Icons />
      <ThemeProvider>
        <FocusProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </FocusProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default RednightApp;
