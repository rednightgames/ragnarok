import {RednightConfig} from "@rednight/shared";
import {ReactNode} from "react";
import {BrowserRouter} from "react-router-dom";

import {ConfigProvider} from "../config";
import {FocusProvider} from "../focus";
import {ThemeInjector} from "../theme";

interface AppProps {
  config: RednightConfig;
  children: ReactNode;
}

const RednightApp = ({config, children}: AppProps) => {
  return (
    <ConfigProvider config={config}>
      <FocusProvider>
        <ThemeInjector>
          <BrowserRouter>{children}</BrowserRouter>
        </ThemeInjector>
      </FocusProvider>
    </ConfigProvider>
  );
};

export default RednightApp;
