import "./Header.scss";

import {AppLink, Avatar, Button, Logo} from "@rednight/components";
import {APPS} from "@rednight/shared";
import {HTMLAttributes} from "react";
import {c} from "ttag";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = ({...restProps}: HeaderProps) => {
  return (
    <header className="header" {...restProps}>
      <div className="section">
        <AppLink to="/" toApp={APPS.LANDING}>
          <Logo />
        </AppLink>
        <div className="links">
          <Button shape="ghost" to="/about" toApp={APPS.LANDING} as={AppLink}>
            {c("Header").t`About`}
          </Button>
          <Button shape="ghost" to="/premium" toApp={APPS.LANDING} as={AppLink}>
            {c("Header").t`Premium`}
          </Button>
          <Button shape="ghost" to="/safety" toApp={APPS.LANDING} as={AppLink}>
            {c("Header").t`Safety`}
          </Button>
          <Button shape="ghost" to="/support" toApp={APPS.LANDING} as={AppLink}>
            {c("Header").t`Support`}
          </Button>
        </div>
      </div>
      <Avatar
        src="https://cdn.rednightgames.com/avatars/153435384675569664"
        size="small"
      />
    </header>
  );
};

export default Header;
