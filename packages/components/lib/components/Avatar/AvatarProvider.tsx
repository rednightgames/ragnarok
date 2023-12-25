import "./Avatar.scss";

import {PolymorphicPropsWithRef} from "@rednight/react-polymorphic-types";
import {clsx} from "@rednight/utils";
import {ElementType, ForwardedRef, forwardRef, useMemo, useState} from "react";

import {AvatarSize} from "./Avatar";
import AvatarContext, {ImageLoadingStatus} from "./AvatarContext";

type AvatarProviderOwnProps = {
  size?: AvatarSize;
};

export type AvatarProviderProps<E extends ElementType> = PolymorphicPropsWithRef<
AvatarProviderOwnProps,
  E
>;

const defaultElement = "button";

const AvatarProvider = <E extends ElementType = typeof defaultElement>(
  {
    as,
    size = "medium",
    ...restProps
  }: AvatarProviderProps<E>,
  ref: ForwardedRef<Element>,
) => {
  const [imageLoadingStatus, setImageLoadingStatus] = useState<ImageLoadingStatus>("idle");

  const Element: ElementType = as || defaultElement;

  const avatarClassName = clsx(
    "avatar-container",
    "rounded-full",
    size !== "medium" && `avatar-${size}`,
  );

  return (
    <AvatarContext.Provider
      value={useMemo(() => ({
        imageLoadingStatus: imageLoadingStatus,
        onImageLoadingStatusChange: setImageLoadingStatus,
      }), [imageLoadingStatus])}
    >
      <Element
        className={avatarClassName}
        ref={ref}
        {...restProps}
      />
    </AvatarContext.Provider>
  );
};

export default forwardRef(AvatarProvider);
