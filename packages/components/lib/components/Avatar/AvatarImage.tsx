import "./Avatar.scss";

import {clsx} from "@rednight/utils";
import {ForwardedRef, forwardRef, useContext, useLayoutEffect, useState} from "react";

import {AvatarSize} from "./Avatar";
import AvatarContext, {ImageLoadingStatus} from "./AvatarContext";

interface AvatarImageProps {
  src: string;
  alt?: string;
  size?: AvatarSize;
}

const useImageLoadingStatus = (src?: string) => {
  const [loadingStatus, setLoadingStatus] = useState<ImageLoadingStatus>("idle");

  useLayoutEffect(() => {
    if (!src) {
      setLoadingStatus("error");
      return;
    }

    let isMounted = true;
    const image = new window.Image();

    const updateStatus = (status: ImageLoadingStatus) => () => {
      if (!isMounted) {
        return;
      }
      
      setLoadingStatus(status);
    };

    setLoadingStatus("loading");
    image.onload = updateStatus("loaded");
    image.onerror = updateStatus("error");
    image.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return loadingStatus;
};

const AvatarImage = (
  {
    src,
    alt,
    size = "medium",
    ...restProps
  }: AvatarImageProps,
  ref: ForwardedRef<HTMLImageElement>,
) => {
  const {onImageLoadingStatusChange} = useContext(AvatarContext);
  const imageLoadingStatus = useImageLoadingStatus(src);

  useLayoutEffect(() => {
    if (imageLoadingStatus !== "idle") {
      onImageLoadingStatusChange(imageLoadingStatus);
    }
  }, [imageLoadingStatus]);

  const avatarClassName = clsx(
    "avatar-img",
    "rounded-full",
    size !== "medium" && `avatar-${size}`,
  );

  return imageLoadingStatus === "loaded" ? (
    <img
      className={avatarClassName}
      {...restProps}
      ref={ref}
      src={src}
      alt={alt}
    />
  ) : null;
};

export default forwardRef(AvatarImage);
