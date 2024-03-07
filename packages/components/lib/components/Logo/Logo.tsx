import "./Logo.scss";

import {PolymorphicPropsWithRef} from "@rednight/react-polymorphic-types";
// @ts-ignore
import accountLogo from "@rednight/styles/assets/img/brand/account.svg";
// @ts-ignore
import redEagle from "@rednight/styles/assets/img/brand/redeagle.svg";
// @ts-ignore
import rednightLogo from "@rednight/styles/assets/img/brand/rednight.svg";
import {clsx} from "@rednight/utils";
import {ElementType, forwardRef, Ref} from "react";

export type LogoSublogo = "default" | "account";

const Sublogos = {
  default: {src: rednightLogo, alt: ""},
  account: {src: accountLogo, alt: "Account"},
} as const;

interface LogoOwnProps {
  sublogo: LogoSublogo;
}

export type LogoProps<E extends ElementType> = PolymorphicPropsWithRef<
  LogoOwnProps,
  E
>;

const defaultElement = "div";

const Logo = <E extends ElementType = typeof defaultElement>(
  {as, sublogo = "default", ...restProps}: LogoProps<E>,
  ref: Ref<Element>,
) => {
  const Element: ElementType = as || defaultElement;

  return (
    <Element className="logo" ref={ref} data-testid="logo" {...restProps}>
      <img src={redEagle} alt="Rednight" />

      {sublogo !== "default" && (
        <svg
          width="1"
          height="20"
          viewBox="0 0 1 20"
          fill="none"
          data-testid=""
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="1" height="20" fill="white" />
        </svg>
      )}
      <img
        className={clsx(sublogo !== "default" && "sublogo")}
        src={Sublogos[sublogo].src}
        alt={Sublogos[sublogo].alt}
      />
    </Element>
  );
};

export default forwardRef(Logo);
