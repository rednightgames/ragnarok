import {RednightConfig} from "@rednight/shared";
import {ReactNode} from "react";
import {BrowserRouter} from "react-router-dom";

import {ConfigProvider} from "../config";
import {FocusProvider} from "../focus";
import {ThemeProvider} from "../theme";

interface AppProps {
  config: RednightConfig;
  children: ReactNode;
}

const RednightApp = ({config, children}: AppProps) => {
  return (
    <ConfigProvider config={config}>
      <ThemeProvider>
        <FocusProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </FocusProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default RednightApp;
