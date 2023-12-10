import "./CircleLoader.scss";

import {clsx, generateUID} from "@rednight/utils";
import {ComponentPropsWithoutRef} from "react";

export type CircleLoaderSize = "small" | "medium" | "large";

export interface CircleLoaderProps extends ComponentPropsWithoutRef<"svg"> {
  size?: CircleLoaderSize;
}

const CircleLoader = ({size, className, ...rest}: CircleLoaderProps) => {
  const uid = generateUID("circle_loader");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("circle-loader", size && `is-${size}`, className)}
      viewBox="0 0 16 16"
      data-testid="circle_loader"
      {...rest}
    >
      <defs>
        <circle
          id={uid}
          cx="8"
          cy="8"
          r="7"
        />
      </defs>
      <use
        href={`#${uid}`}
        className="circle-loader-track"
      />
      <use
        href={`#${uid}`}
        className="circle-loader-circle"
      />
    </svg>
  );
};

export default CircleLoader;
