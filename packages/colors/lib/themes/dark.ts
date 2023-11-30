import {createGlobalStyle} from "styled-components";

export const DarkTheme = createGlobalStyle`
    :root {
        // colors
        --primary: #393942;
        --primary-major-1: #222228;
        --primary-major-2: #121216;

        --secondary: #232427;
        --secondary-major-1: #1a1b1e;
        --secondary-major-2: #111113;

        --brand: #9747ff;

        --danger: #ed4245;
        --danger-major-1: #9f282b;
        --danger-major-2: #7c1a1b;

        --warning: #ff9900;
        --warning-major-1: #bd7300;
        --warning-major-2: #8a5300;

        --success: #3ba55d;
        --success-major-1: #30864c;
        --success-major-2: #256e3c;

        // text
        --text-norm: #ffffff;
        --text-hint: #8f8d8a;
        --text-weak: #5c5958;
        --text-invert: #000000;

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
