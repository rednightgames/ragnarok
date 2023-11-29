import {InvertThemeColors, ThemeColorUnion} from "@rednight/colors";
import styled, {css} from "styled-components";

import {ButtonShape} from "./Button";

interface StyledButtonProps {
  $shape?: ButtonShape;
  $color: ThemeColorUnion;
  $focused: boolean;
  $fullWith: boolean;
  $loading: boolean;
  disabled: boolean;
}

export const StyledButton = styled.div<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  outline-offset: 4px;
  outline-color: var(--focus-ring);

  & u {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    text-decoration: none;
  }

  &:focus-visible {
    outline: none;
  }
    
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

      ${props.$loading && css`
        cursor: default;

        & u {
          display: flex;
          align-items: center;
          pointer-events: none;
          color: var(--${props.$color}-hover);
        }

        & u:after {
          height: 0;
        }
      `}
        
      ${props.disabled && css`
        cursor: default;

        & u {
          display: flex;
          align-items: center;
          pointer-events: none;
          color: var(--${props.$color}-disabled);
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
        padding: 5px 16px;
        border-radius: 12px;
        color: var(--text-norm);
        transition: background-color 0.3s;
        background-color: var(--${props.$color});
      }

      &:hover u {
        background-color: var(--${props.$color}-hover);
      }

      ${InvertThemeColors.includes(props.$color) && css`
        & u {
          color: var(--text-invert);
        }
      `}

      ${props.$loading && css`
        cursor: default;
        pointer-events: none;

        & u {
          cursor: default;
          background-color: var(--${props.$color}-hover);
        }

        &:hover u {
          background-color: var(--${props.$color}-hover);
        }
      `}

      ${props.disabled && css`
        cursor: default;
        pointer-events: none;

        & u {
          cursor: default;
          background-color: var(--${props.$color}-disabled);
        }

        &:hover u {
          background-color: var(--${props.$color}-disabled);
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
        padding: 12px 20px;
        border-radius: 12px;
        color: var(--${props.$color});
        transition:
          color 0.3s,
          border 0.3s;
        border: var(--${props.$color}) solid 1px;
      }

      &:hover u {
        color: var(--${props.$color}-hover);
        border: var(--${props.$color}-hover) solid 1px;
      }

      ${props.$loading && css`
        cursor: default;

        & u {
          color: var(--${props.$color}-hover);
          border: var(--${props.$color}-hover) solid 1px;
        }

        &:hover u {
          color: var(--${props.$color}-hover);
          border: var(--${props.$color}-hover) solid 1px;
        }
      `}
        
      ${props.disabled && css`
        cursor: default;

        & u {
          color: var(--${props.$color}-disabled);
          border: var(--${props.$color}-disabled) solid 1px;
        }

        &:hover u {
          color: var(--${props.$color}-disabled);
          border: var(--${props.$color}-disabled) solid 1px;
        }
      `}

      ${props.$focused && css`
        outline: var(--focus-ring) solid 2px;
      `}
    `}
`;
