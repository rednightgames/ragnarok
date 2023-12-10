import {ThemeContext} from "@containers/theme";
import {useContext} from "react";

export const useTheme = () => {
  return useContext(ThemeContext);
};
