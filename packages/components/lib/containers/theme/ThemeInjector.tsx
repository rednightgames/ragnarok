import {useTheme} from "@hooks";
import {BaseTheme, DarkTheme} from "@rednight/colors";
import {ThemeModeSetting} from "@rednight/shared";
import {ReactNode} from "react";

import {ThemeProvider} from "./";

interface ThemeInjectorProps {
  children: ReactNode;
}

const ThemeInjector = ({children}: ThemeInjectorProps) => {
  const {settings} = useTheme();
  const {Mode} = settings;

  return (
    <ThemeProvider>
      <BaseTheme />
      {Mode === ThemeModeSetting.Dark && <DarkTheme />}
      {children}
    </ThemeProvider>
  );
};

export default ThemeInjector;
