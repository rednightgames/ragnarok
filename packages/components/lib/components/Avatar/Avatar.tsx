import { PolymorphicPropsWithRef } from "@rednight/react-polymorphic-types";
import "./Avatar.scss";

import {ElementType, ForwardedRef, HTMLProps, forwardRef} from "react";
import { clsx } from "@rednight/utils";

export type AvatarSize = "small" | "medium" | "large";

interface AvatarOwnProps {
  src: string;
  /**
   * Controls how large the avatar should be.
   */
  size?: AvatarSize;
}

export type AvatarProps<E extends ElementType> = PolymorphicPropsWithRef<
AvatarOwnProps,
  E
>;

const defaultElement = "button";

const Avatar = <E extends ElementType = typeof defaultElement>(
  {
    src,
    size = "medium",
    as,
    ...restProps
  }: AvatarProps<E>,
  ref: ForwardedRef<Element>,
) => {
  const Element: ElementType = as || defaultElement;

  const avatarClassName = clsx(
    "avatar",
    "rounded-full",
    size !== "medium" && `avatar-${size}`,
  );

  return (
    <Element
      className={avatarClassName}
    >
      <img
        className={clsx(
        "rounded-full",
        "avatar-img"
        )}
        src={src}
        {...restProps}
      />
    </Element>
  );
};

export default forwardRef(Avatar);
