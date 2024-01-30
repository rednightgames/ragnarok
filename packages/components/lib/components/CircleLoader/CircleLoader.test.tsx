import "@testing-library/jest-dom";

import {render, screen} from "@testing-library/react";

import CircleLoader from "./CircleLoader";

describe("CircleLoader component", () => {
  it("renders without crashing", () => {
    render(<CircleLoader />);
  });

  it("renders with the specified size", () => {
    render(<CircleLoader size="small" />);
    const circleLoader = screen.getByTestId("circle_loader");

    expect(circleLoader).toHaveClass("is-small");
  });

  it("applies additional className prop", () => {
    render(<CircleLoader className="custom-class" />);
    const circleLoader = screen.getByTestId("circle_loader");

    expect(circleLoader).toHaveClass("custom-class");
  });
});
