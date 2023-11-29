import {ThemeModeSetting, ThemeSetting} from "@rednight/shared";
import {ReactNode, useCallback, useMemo, useState} from "react";

import ThemeContext from "./themeContext";

interface ThemeProviderProps {
  children?: ReactNode;
}

const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [settings, setSettings] = useState<ThemeSetting>({
    Mode: ThemeModeSetting.Dark,
  });

  const setTheme = useCallback((mode: ThemeModeSetting) => {
    setSettings({...settings, Mode: mode});
  }, []);

  return (
    <ThemeContext.Provider
      value={useMemo(() => ({
        setTheme,
        settings,
      }), [])}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
