import {
  DEFAULT_THEME,
  ThemeFeatureSetting,
  ThemeFontSizeSetting,
  ThemeModeSetting,
  ThemeSetting,
  ThemeTypes,
} from "@rednight/shared";
import {noop} from "@rednight/utils";
import {createContext} from "react";

export interface ThemeContextInterface {
  setTheme: (themeType: ThemeTypes, mode?: ThemeModeSetting) => void;
  setThemeSetting: (theme?: ThemeSetting) => void;
  setAutoTheme: (enabled: boolean) => void;
  setFontSize: (fontSize: ThemeFontSizeSetting) => void;
  setFeature: (featureBit: ThemeFeatureSetting, toggle: boolean) => void;
  settings: ThemeSetting;
  addListener: (cb: (data: ThemeSetting) => void) => () => void;
}

export default createContext<ThemeContextInterface>({
  setTheme: noop,
  setThemeSetting: noop,
  setAutoTheme: noop,
  setFontSize: noop,
  setFeature: noop,
  settings: {
    LightTheme: DEFAULT_THEME,
    DarkTheme: DEFAULT_THEME,
    Mode: ThemeModeSetting.Dark,
    FontSize: ThemeFontSizeSetting.DEFAULT,
    Features: ThemeFeatureSetting.DEFAULT,
  },
  addListener: () => noop,
});
