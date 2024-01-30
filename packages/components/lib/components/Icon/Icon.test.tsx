import "@testing-library/jest-dom";

import {render, screen} from "@testing-library/react";

import Icon from "./Icon";

// Mock SVG sprite
vi.mock("./icon-sprite.svg", () => ({
    "#ic-account": "mocked-account-svg",
    "#ic-checkmark": "mocked-checkmark-svg",
    "#ic-minus": "mocked-minus-svg",
  }));

describe("Icon component", () => {
    test("renders the correct icon", () => {
        render(
          <Icon
            name="account"
          />,
        );
        const svgElement = screen.getByTestId("icon");
    
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveClass("icon-16p");
        expect(svgElement).toContainHTML("<use xlink:href=\"#ic-account\"></use>");
      });
    
      test("applies additional classes", () => {
        render(
          <Icon
            name="checkmark"
            className="custom-class"
          />,
        );
        const svgElement = screen.getByTestId("icon");
    
        expect(svgElement).toHaveClass("icon-16p");
        expect(svgElement).toHaveClass("custom-class");
      });
    
      test("renders with alt text", () => {
        render(
          <Icon
            name="minus"
            alt="Minus Icon"
          />,
        );
        const spanElement = screen.getByText("Minus Icon");
    
        expect(spanElement).toBeInTheDocument();
        expect(spanElement).toHaveClass("sr-only");
      });
    
      test("applies color and rotation", () => {
        render(
          <Icon
            name="account"
            color="red"
            rotate={45}
          />,
        );
        const svgElement = screen.getByTestId("icon");
    
        expect(svgElement).toHaveStyle("color: rgb(255, 0, 0)");
        expect(svgElement).toHaveStyle("transform: rotate(45deg)");
      });
});
