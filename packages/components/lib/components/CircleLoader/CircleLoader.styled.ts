import styled from "styled-components";

export const StyledCircleLoader = styled.svg`
  display: inline-block;
  inline-size: 16px;
  block-size: 16px;
  transform-origin: 50%;
  font-size: 16px;
  vertical-align: middle;
`;

export const StyledLoaderCircle = styled.use`
  fill: none;
  stroke-width: var(--stroke-width, 2);
  stroke-linecap: round;
  stroke: currentcolor;
  stroke-dasharray: 26.2194px, 17.4796px;
  animation: anime-loader-stroke 1s linear infinite;

  @keyframes anime-loader-stroke {
    from {
      stroke-dashoffset: 43.699;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
`;

export const StyledCircle = styled.use`
  opacity: 0.2;
  fill: none;
  stroke-width: var(--stroke-width, 2);
  stroke-linecap: round;
  stroke: currentcolor;
`;
