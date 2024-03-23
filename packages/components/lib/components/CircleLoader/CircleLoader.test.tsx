import "@testing-library/jest-dom";

import {render, screen} from "@testing-library/react";

import CircleLoader from "./CircleLoader";

describe("CircleLoader component", () => {
  it("renders without crashing", () => {
    render(<CircleLoader data-testid="circle_loader" />);
    const circleLoader = screen.getByTestId("circle_loader");

    expect(circleLoader).toHaveClass("circle-loader");
  });

  it("renders with the specified size", () => {
    render(<CircleLoader size="small" data-testid="circle_loader" />);
    const circleLoader = screen.getByTestId("circle_loader");

    expect(circleLoader).toHaveClass("is-small");
  });

  it("applies additional className prop", () => {
    render(
      <CircleLoader className="custom-class" data-testid="circle_loader" />,
    );
    const circleLoader = screen.getByTestId("circle_loader");

    expect(circleLoader).toHaveClass("custom-class");
  });
});
