import {InvertThemeColors, ThemeColorUnion} from "@rednight/colors";
import styled, {css} from "styled-components";

import {ButtonShape, ButtonSize} from "./Button";

interface StyledButtonProps {
  $shape?: ButtonShape;
  $color: ThemeColorUnion;
  $size: ButtonSize;
  $focused: boolean;
  $fullWith: boolean;
  $loading: boolean;
  disabled: boolean;
}

export const StyledButton = styled.div<StyledButtonProps>`
  text-decoration: none;
  cursor: pointer;
  outline-color: var(--focus-ring);

  & u {
    display: flex;
    justify-content: center;
    gap: 5px;
    text-decoration: none;
  }
    
  ${(props: StyledButtonProps) => css`
    ${props.$size === "small" && css`
      & u {
        padding: 3px 11px;
      }
    `}
    ${props.$size === "medium" && css`
      & u {
        padding: 7px 15px;
      }
    `}
    ${props.$size === "large" && css`
      & u {
        padding: 9px 19px;
      }
    `}
  `}

  ${(props: StyledButtonProps) => props.$fullWith && css`
    width: 100%;
  `}
  
  ${(props: StyledButtonProps) =>
    props.$shape === "ghost" && css`
      color: var(--${props.$color});

      & u {
        display: inline-block;
        line-height: 1;
        text-decoration: none;
        cursor: pointer;
        position: relative;
      }

      & u:after {
        display: block;
        content: "";
        background-color: var(--${props.$color});
        height: 2px;
        width: 0;
        left: 50%;
        position: absolute;
        transition: width 0.3s ease-in-out;
        transform: translateX(-50%);
      }

      &:hover u:after,
      &:not(:focus-visible):focus u:after {
        width: 100%;
      }
        
      ${props.disabled && css`
        cursor: default;

        & u {
          display: flex;
          align-items: center;
          color: var(--${props.$color}-${props.$loading ? `major-1` : `major-2`});
        }

        & u:after {
          height: 0;
        }
      `}

      ${props.$focused && css`
        outline: var(--focus-ring) solid 2px;
      `}
    `}

  ${(props: StyledButtonProps) =>
    props.$shape === "solid" && css`
      & u {
        width: 100%;
        border-radius: 8px;
        color: var(--text-norm);
        transition: background-color 0.3s;
        background-color: var(--${props.$color});
      }

      &:hover u {
        background-color: var(--${props.$color}-major-1);
      }
      
      &:active u {
          background-color: var(--${props.$color}-major-2);
      }

      ${InvertThemeColors.includes(props.$color) && css`
        & u {
          color: var(--text-invert);
        }
      `}

      ${props.disabled && css`
        cursor: default;

        & u {
          background-color: var(--${props.$color}-${props.$loading ? `major-1` : `major-2`});
        }

        &:hover u {
          background-color: var(--${props.$color}-${props.$loading ? `major-1` : `major-2`});
        }
      `}

      ${props.$focused && css`
        outline: var(--focus-ring) solid 2px;
      `}
    `}

  ${(props: StyledButtonProps) =>
    props.$shape === "outline" && css`
      & u {
        width: 100%;
        border-radius: 12px;
        color: var(--${props.$color});
        transition: color 0.3s, border 0.3s;
        border: var(--${props.$color}) solid 1px;
      }

      &:hover u {
        color: var(--${props.$color}-major-1);
        border: var(--${props.$color}-major-1) solid 1px;
      }

      ${props.disabled && css`
        cursor: default;

        & u {
          color: var(--${props.$color}-${props.$loading ? `major-1` : `major-2`});
          border: var(--${props.$color}-${props.$loading ? `major-1` : `major-2`}) solid 1px;
        }

        &:hover u {
          color: var(--${props.$color}-${props.$loading ? `major-1` : `major-2`});
          border: var(--${props.$color}-${props.$loading ? `major-1` : `major-2`}) solid 1px;
        }
      `}

      ${props.$focused && css`
        outline: var(--focus-ring) solid 2px;
      `}
    `}
`;
