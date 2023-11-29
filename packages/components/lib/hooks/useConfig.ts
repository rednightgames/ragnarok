import {ConfigContext} from "@containers/config";
import {useContext} from "react";

const useConfig = () => {
  return useContext(ConfigContext);
};

export default useConfig;
