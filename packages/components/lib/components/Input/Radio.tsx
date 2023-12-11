import {clsx} from "@rednight/utils";
import {InputHTMLAttributes} from "react";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
  name: string;
  disabled?: boolean;
}

const Radio = ({
  id,
  children,
  className = "inline-flex",
  name,
  disabled = false,
    ...rest
}: RadioProps) => {
  return (
    <label
      htmlFor={id}
      className={clsx([
        !className?.includes("increase-click-surface") && "relative",
        disabled && "opacity-50 no-pointer-events",
        className,
      ])}
    >
      <input
        id={id}
        type="radio"
        className="radio"
        name={name}
        disabled={disabled}
        {...rest}
      />
      <span className={clsx("radio-fakeradio shrink-0", children ? "mr-2" : "")} />
      {children}
    </label>
  );
};

export default Radio;
