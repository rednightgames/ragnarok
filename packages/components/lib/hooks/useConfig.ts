import {ConfigContext} from "@containers/config";
import {useContext} from "react";

export const useConfig = () => {
  return useContext(ConfigContext);
};
