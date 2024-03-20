import {Logo} from "@components/Logo";
import {HTMLAttributes} from "react";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = ({...restProps}: HeaderProps) => {
  return (
    <header {...restProps}>
      <Logo />
      <div />
    </header>
  );
};

export default Header;
