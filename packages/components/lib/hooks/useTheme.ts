import {ThemeContext} from "@containers/theme";
import {useContext} from "react";

const useTheme = () => {
  return useContext(ThemeContext);
};

export default useTheme;
