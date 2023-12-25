import {noop} from "@rednight/utils";
import {createContext} from "react";

export type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

type AvatarContextInterface = {
  imageLoadingStatus: ImageLoadingStatus;
  onImageLoadingStatusChange(status: ImageLoadingStatus): void;
};

export default createContext<AvatarContextInterface>({
  imageLoadingStatus: "idle",
  onImageLoadingStatusChange: noop,
});
