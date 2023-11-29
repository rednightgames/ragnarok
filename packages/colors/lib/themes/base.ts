import {createGlobalStyle} from "styled-components";

export const BaseTheme = createGlobalStyle`
  *,
  *:before,
  *:after {
    padding: 0;
    margin: 0;
    border: 0;
    box-sizing: border-box;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }

  html,
  body {
    background-color: var(--background);
    font-family: Inter, sans-serif;
    font-size: 16px;
    font-weight: 500;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  svg {
    display: block;
    overflow: hidden;
  }

  button {
    background-color: transparent;
    appearance: none;
  }

  u {
    text-decoration: none;
  }

  ::selection {
    background-color: rgba(120 117 240 / .25);
  }
`;
