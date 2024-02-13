import {clsx} from "@rednight/utils";
import {Key, ReactNode} from "react";

import Radio from "./Radio";

export interface RadioGroupProps<T> {
  /**
   * Controls the name of the radio.
   */
  name: string;
  /**
   * Array of radio buttons.
   */
  options: {
    key?: Key;
    value: T;
    label: ReactNode;
    disabled?: boolean;
  }[];
  /**
   * Callback for change selected radio
   * @param value from options
   */
  onChange: (value: T) => void;
  /**
   * The current checked value
   */
  value: T;
  className?: string;
  ["aria-describedby"]?: string;
}

const RadioGroup = <T,>({
  name,
  options,
  onChange,
  value,
  className,
  "aria-describedby": ariaDescribedBy,
}: RadioGroupProps<T>) => {
  return (
    <>
      {options.map((option, i) => (
        <Radio
          key={option.key || `${i}`}
          id={`${name}-radio_${i}`}
          onChange={() => onChange(option.value)}
          checked={value === option.value}
          name={name}
          className={clsx("inline-flex children-self-center mr-8 mb-2", className)}
          disabled={option.disabled}
          aria-describedby={ariaDescribedBy}
        >
          {option.label}
        </Radio>
      ))}
    </>
  );
};

export default RadioGroup;
