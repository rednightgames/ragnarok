import {RednightConfig} from "@rednight/shared";
import {ReactNode} from "react";
import {BrowserRouter} from "react-router-dom";

import {ConfigProvider} from "../config";

interface AppProps {
  config: RednightConfig;
  children: ReactNode;
}

const RednightApp = ({config, children}: AppProps) => {
  return (
    <ConfigProvider config={config}>
      <BrowserRouter>{children}</BrowserRouter>
    </ConfigProvider>
  );
};

export default RednightApp;
