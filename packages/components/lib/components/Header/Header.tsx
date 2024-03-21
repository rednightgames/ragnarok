import "./Header.scss";

import {Button} from "@components/Button";
import {Logo} from "@components/Logo";
import {HTMLAttributes} from "react";
import {c} from "ttag";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = ({...restProps}: HeaderProps) => {
  return (
    <header {...restProps}>
      <Logo />
      <div>
        <Button to="/">{c("Header").t`About`}</Button>
      </div>
    </header>
  );
};

export default Header;
