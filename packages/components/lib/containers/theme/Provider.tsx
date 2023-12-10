import {
  clearBit,
  ColorScheme, createListeners, DEFAULT_THEME, getCookie, getDarkThemes,
  getDefaultThemeSetting,
  getParsedThemeSetting, getSecondLevelDomain, getThemeType,
  isDeepEqual, serializeThemeSetting, setBit, setCookie, ThemeFeatureSetting, ThemeFontSizeSetting,
  ThemeModeSetting, THEMES_MAP,
  ThemeSetting, ThemeTypes,
} from "@rednight/shared";
import {ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react";

import ThemeContext from "./themeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

export const getThemeStyle = (themeType: ThemeTypes = DEFAULT_THEME) => {
  return THEMES_MAP[themeType]?.theme || THEMES_MAP[DEFAULT_THEME].theme;
};

const THEME_COOKIE_NAME = "theme";

const storedTheme = getCookie(THEME_COOKIE_NAME);

export const THEME_ID = "theme-root";

const matchMediaScheme = window.matchMedia("(prefers-color-scheme: dark)");

const getColorScheme = (matches: boolean): ColorScheme => {
  return matches ? ColorScheme.Dark : ColorScheme.Light;
};

const listeners = createListeners<[ThemeSetting]>();

const darkThemes = getDarkThemes();

const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [themeSetting, setThemeSettingDefault] = useState(() => {
    return getParsedThemeSetting(storedTheme);
  });
  const setThemeSetting = useCallback((theme: ThemeSetting = getDefaultThemeSetting()) => {
    setThemeSettingDefault((oldTheme: ThemeSetting) => {
      if (isDeepEqual(theme, oldTheme)) {
        return oldTheme;
      }
      return theme;
    });
  }, []);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    return getColorScheme(matchMediaScheme.matches);
  });

  useLayoutEffect(() => {
    setColorScheme(getColorScheme(matchMediaScheme.matches));
    const listener = (e: MediaQueryListEvent) => {
      setColorScheme(getColorScheme(e.matches));
    };

    matchMediaScheme.addEventListener?.("change", listener);
    return () => {
      matchMediaScheme.removeEventListener?.("change", listener);
    };
  }, []);

  const syncThemeSettingValue = (theme: ThemeSetting) => {
    listeners.notify(theme);
    setThemeSetting(theme);
  };

  const setTheme = (themeType: ThemeTypes, mode?: ThemeModeSetting) => {
    if (mode) {
      syncThemeSettingValue({
        ...themeSetting,
        Mode: ThemeModeSetting.Auto,
        [mode === ThemeModeSetting.Dark ? "DarkTheme" : "LightTheme"]: themeType,
      });
      return;
    }

    if (darkThemes.includes(themeType)) {
      syncThemeSettingValue({...themeSetting, Mode: ThemeModeSetting.Dark, DarkTheme: themeType});
    } else {
      syncThemeSettingValue({...themeSetting, Mode: ThemeModeSetting.Light, LightTheme: themeType});
    }
  };

  const setAutoTheme = (enabled: boolean) => {
    if (enabled) {
      syncThemeSettingValue({...themeSetting, Mode: ThemeModeSetting.Auto});
    } else {
      syncThemeSettingValue({
        ...themeSetting,
        Mode: colorScheme === ColorScheme.Light ? ThemeModeSetting.Light : ThemeModeSetting.Dark,
      });
    }
  };

  const setFontSize = (fontSize: ThemeFontSizeSetting) => {
    syncThemeSettingValue({...themeSetting, FontSize: fontSize});
  };

  const setFeature = (featureBit: ThemeFeatureSetting, toggle: boolean) => {
    syncThemeSettingValue({
      ...themeSetting,
      Features: toggle ? setBit(themeSetting.Features, featureBit) : clearBit(themeSetting.Features, featureBit),
    });
  };

  const theme = getThemeType(themeSetting, colorScheme);

  const style = getThemeStyle(theme);

  useEffect(() => {
    const syncToMeta = () => {
      const themeMeta = document.querySelector(`meta[name="theme-color"]`);
      const uiProminentElement = document.querySelector(".ui-prominent");
      const themeColor = uiProminentElement
        ? window.getComputedStyle(uiProminentElement).getPropertyValue("--background-norm").trim()
        : "";

      if (themeMeta && themeColor) {
        themeMeta.setAttribute("content", themeColor);
      }
    };

    syncToMeta();
  }, [theme]);

  useEffect(() => {
    return () => {
      listeners.clear();
    };
  }, []);

  useEffect(() => {
    const syncToCookie = () => {
      const cookieValue = serializeThemeSetting(themeSetting);
      // Note: We might set `undefined` which will clear the cookie
      setCookie({
        cookieName: THEME_COOKIE_NAME,
        cookieValue,
        cookieDomain: getSecondLevelDomain(window.location.hostname),
        path: "/",
        expirationDate: "max",
      });
    };

    syncToCookie();
  }, [themeSetting]);

  return (
    <ThemeContext.Provider
      value={useMemo(() => ({
        settings: themeSetting,
        setTheme,
        setThemeSetting,
        setAutoTheme,
        setFontSize,
        setFeature,
        addListener: listeners.subscribe,
      }), [])}
    >
      <style id={THEME_ID}>{style.default}</style>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
