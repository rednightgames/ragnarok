import {useTheme} from "@hooks";
import {ThemeTypes} from "@rednight/shared";
import {ReactNode, useLayoutEffect} from "react";

const UnAuthenticated = ({
  children,
  theme: maybeTheme,
}: {
  children: ReactNode;
  theme?: ThemeTypes;
}) => {
  const theme = useTheme();

  useLayoutEffect(() => {
    theme.setThemeSetting();
    if (maybeTheme !== undefined) {
      theme.setTheme(maybeTheme);
    }
  }, [maybeTheme]);

  return children;
};

export default UnAuthenticated;
