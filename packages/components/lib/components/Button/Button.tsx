import {useFocusVisible} from "@hooks";
import {ThemeColor, ThemeColorUnion} from "@rednight/colors";
import {ElementType, ForwardedRef, forwardRef} from "react";
import {PolymorphicPropsWithRef} from "react-polymorphic-types";

import {CircleLoader} from "../CircleLoader";
import {StyledButton} from "./Button.styled";

export type ButtonShape = "ghost" | "solid" | "outline";

export type ButtonSize = "small" | "medium" | "large";

interface ButtonOwnProps {
  /**
   * Whether the button should render a loader.
   * Button is disabled when this prop is true.
   */
  loading?: boolean;
  /**
   * Controls the shape of the button.
   * - `ghost` for texted button
   * - `solid` for filled button
   * - `outline` for bordered button
   */
  shape?: ButtonShape;
  /**
   * Controls the colors of the button.
   * Exact styles applied to depend on the chosen shape as well.
   */
  color?: ThemeColorUnion;
  /**
   * Controls how large the button should be.
   */
  size?: ButtonSize;
  /**
   * Controls the width of the button.
   * - `false` for width of text length
   * - `true` for width of parent container
   */
  fullWidth?: boolean;
  /**
   * Puts the button in a disabled state.
   */
  disabled?: boolean;
  /**
   * Locator for e2e tests.
   */
  "data-testid"?: string;
}

export type ButtonProps<E extends ElementType> = PolymorphicPropsWithRef<
  ButtonOwnProps,
  E
>;

const defaultElement = "button";

const Button = <E extends ElementType = typeof defaultElement>(
  {
    loading = false,
    disabled = false,
    fullWidth = false,
    tabIndex,
    children,
    shape: shapeProp,
    color = ThemeColor.Primary,
    size = "medium",
    as,
    "data-testid": dataTestId,
    ...restProps
  }: ButtonProps<E>,
  ref: ForwardedRef<Element>,
) => {
  const {focusVisible, onInput, onFocus, onBlur} = useFocusVisible();
  const isDisabled = loading || disabled;

  const Element: ElementType = as || defaultElement;

  const roleProps =
    restProps.onClick && !restProps.type ? {role: "button"} : undefined;

  return (
    <StyledButton
      as={Element}
      $shape={shapeProp}
      $color={color}
      $size={size}
      $focused={focusVisible}
      $fullWith={fullWidth}
      $loading={loading}
      onFocus={onFocus}
      onBlur={onBlur}
      onInput={onInput}
      disabled={isDisabled}
      ref={ref}
      tabIndex={isDisabled ? -1 : tabIndex}
      aria-busy={loading}
      data-testid={dataTestId}
      {...roleProps}
      {...restProps}
    >
      <u>
        {children}
        {loading && <CircleLoader />}
      </u>
    </StyledButton>
  );
};

export default forwardRef(Button);
