import {createGlobalStyle} from "styled-components";

export const DarkTheme = createGlobalStyle`
  :root {
    // colors
    --primary: #121216;
    --primary-hover: #0a0a0c;
    --primary-disabled: #000000;

    --secondary: #232427;
    --secondary-hover: #1a1b1e;
    --secondary-disabled: #111113;

    --brand: #9747ff;

    --danger: #ed4245;
    --danger-hover: #cb3c3e;
    --danger-disabled: #a23233;

    --warning: #ff9900;
    --warning-hover: #bd7300;
    --warning-disabled: #8a5300;

    --success: #3ba55d;
    --success-hover: #30864c;
    --success-disabled: #256e3c;

    // text
    --text-norm: #ffffff;
    --text-hint: #8f8d8a;
    --text-weak: #5c5958;

    // field
    --field-norm: #232427;
    --field-hover: #1E1E21;
    --field-disabled: #151517;

    // background
    --background: #09090D;
    --background-weak: #121216;
    --background-strong: #232427;

    // focus
    --focus-ring: var(--brand);
  }
`;
