import {ThemeModeSetting, ThemeSetting} from "@rednight/shared";
import {noop} from "@rednight/utils";
import {createContext} from "react";

export interface ThemeContextInterface {
  setTheme: (mode: ThemeModeSetting) => void;
  settings: ThemeSetting;
}

export default createContext<ThemeContextInterface>({
  setTheme: noop,
  settings: {
    Mode: ThemeModeSetting.Dark,
  },
});
