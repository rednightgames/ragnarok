import {clsx, generateUID} from "@rednight/utils";
import {InputHTMLAttributes} from "react";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Controls the name of the radio.
   */
  name: string;
  /**
   * Puts the radio in a disabled state.
   */
  disabled?: boolean;
  /**
   * Locator for e2e tests.
   */
  "data-testid"?: string;
}

const Radio = ({
  id = generateUID("radio"),
  children,
  className = "inline-flex",
  name,
  disabled = false,
  "data-testid": dataTestId,
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
      data-testid={dataTestId && `${dataTestId}-label`}
    >
      <input
        id={id}
        type="radio"
        className="radio"
        name={name}
        disabled={disabled}
        data-testid={dataTestId && `${dataTestId}-input`}
        {...rest}
      />
      <span
        className={clsx("radio-fakeradio shrink-0", children ? "mr-2" : "")}
        data-testid={dataTestId && `${dataTestId}-span`}
      />
      {children}
    </label>
  );
};

export default Radio;
