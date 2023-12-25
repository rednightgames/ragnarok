import "./Avatar.scss";

import {PolymorphicPropsWithRef} from "@rednight/react-polymorphic-types";
import {ElementType, ForwardedRef, forwardRef} from "react";

import AvatarFallback from "./AvatarFallback";
import AvatarImage from "./AvatarImage";
import AvatarProvider from "./AvatarProvider";

export type AvatarSize = "small" | "medium" | "large";

interface AvatarOwnProps {
  /**
   * User avatar path
   */
  src: string;
  /**
   * Letter displayed when avatar loading error or missing avatar
   */
  fallback?: string;
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

const generateColor = (str?: string) => {
  if (!str) {
    return "var(--primary)";
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = "#";
  for (let j = 0; j < 3; j++) {
    let value = (hash >> (j * 8)) & 0xFF;
    color += ("00" + value.toString(16)).slice(-2);
  }
  
  return color;
};

const Avatar = <E extends ElementType = typeof defaultElement>(
  {
    src,
    fallback,
    size = "medium",
    as,
    ...restProps
  }: AvatarProps<E>,
  ref: ForwardedRef<Element>,
) => {
  return (
    <AvatarProvider
      {...restProps}
      style={{
      "--avatar-color": generateColor(fallback),
      }}
      size={size}
      ref={ref}
      as={as}
    >
      <AvatarImage
        alt={fallback}
        size={size}
        src={src}
      />
      <AvatarFallback>{fallback?.charAt(0)}</AvatarFallback>
    </AvatarProvider>
  );
};

export default forwardRef(Avatar);
