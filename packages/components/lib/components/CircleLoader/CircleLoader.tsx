import {generateUID} from "@rednight/utils";
import {ComponentPropsWithoutRef} from "react";

import {
  StyledCircle,
  StyledCircleLoader,
  StyledLoaderCircle,
} from "./CircleLoader.styled";

export type CircleLoaderProps = ComponentPropsWithoutRef<"svg">;

const CircleLoader = ({...rest}: CircleLoaderProps) => {
  const uid = generateUID("circle_loader");

  return (
    <StyledCircleLoader
      xmlns="http://www.w3.org/2000/svg"
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
      <StyledCircle href={`#${uid}`} />
      <StyledLoaderCircle href={`#${uid}`} />
    </StyledCircleLoader>
  );
};

export default CircleLoader;
