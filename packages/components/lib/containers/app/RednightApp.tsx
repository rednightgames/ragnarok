import {RednightConfig} from "@rednight/shared";
import {ReactNode} from "react";
import {BrowserRouter} from "react-router-dom";

import {ConfigProvider} from "../config";
import {FocusProvider} from "../focus";

interface AppProps {
  config: RednightConfig;
  children: ReactNode;
}

const RednightApp = ({config, children}: AppProps) => {
  return (
    <ConfigProvider config={config}>
      <FocusProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </FocusProvider>
    </ConfigProvider>
  );
};

export default RednightApp;
