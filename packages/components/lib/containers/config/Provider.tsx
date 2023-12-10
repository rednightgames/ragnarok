import {RednightConfig} from "@rednight/shared";
import {ReactNode} from "react";

import ConfigContext from "./configContext";

interface ConfigProviderProps {
  children?: ReactNode;
  config: RednightConfig;
}

const ConfigProvider = ({config, children}: ConfigProviderProps) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export default ConfigProvider;
