import "./Header.scss";

import {AppLink, Button, Logo} from "@rednight/components";
import {APPS} from "@rednight/shared";
import {HTMLAttributes} from "react";
import {c} from "ttag";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = ({...restProps}: HeaderProps) => {
  return (
    <header {...restProps}>
      <AppLink to="/" toApp={APPS.ACCOUNT}>
        <Logo />
      </AppLink>
      <div>
        <Button shape="ghost" to="/about" toApp={APPS.ACCOUNT} as={AppLink}>
          {c("Header").t`About`}
        </Button>
      </div>
    </header>
  );
};

export default Header;
