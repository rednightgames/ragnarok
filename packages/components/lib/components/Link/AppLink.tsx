import {useConfig} from "@hooks";
import {APP_NAMES, getAppHrefBundle} from "@rednight/shared";
import {AnchorHTMLAttributes, forwardRef, Ref} from "react";
import {Link as ReactRouterLink} from "react-router-dom";

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color"> & {
  /**
   * Provide the link href.
   */
  to: string;
  /**
   * Controls link target app.
   */
  toApp?: APP_NAMES;
  /**
   * Controls self opening.
   */
  selfOpening?: boolean;
};

const AppLink = (
  {to, toApp, selfOpening = false, children, ...rest}: AppLinkProps,
  ref: Ref<HTMLAnchorElement>,
) => {
  const {APP_NAME} = useConfig();

  const targetApp = selfOpening ? APP_NAME : toApp;

  if (targetApp && (targetApp !== APP_NAME || selfOpening)) {
    const href = getAppHrefBundle(to, targetApp);

    return (
      <a
        ref={ref}
        target="_self"
        {...rest}
        href={href}
      >
        {children}
      </a>
    );
  }

  return (
    <ReactRouterLink
      ref={ref}
      to={to}
      {...rest}
    >
      {children}
    </ReactRouterLink>
  );
};

export default forwardRef<HTMLAnchorElement, AppLinkProps>(AppLink);
