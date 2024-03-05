import "@testing-library/jest-dom";

import {render} from "@testing-library/react";
import Logo from "./Logo";

describe("Logo Component", () => {
  it("renders with default sublogo", () => {
    const {getByTestId} = render(<Logo />);
    expect(getByTestId("logo")).toBeInTheDocument();
  });

  it("renders with account sublogo", () => {
    const {getByTestId} = render(<Logo sublogo="account" />);
    expect(getByTestId('logo')).toBeInTheDocument();
  });

  it("renders with custom element", () => {
    const {getByTestId} = render(<Logo as="span" />);
    expect(getByTestId("logo")).toBeInTheDocument();
  });

  it("renders with custom class", () => {
    const {getByTestId} = render(<Logo className="custom-class" />);
    expect(getByTestId("logo")).toHaveClass("custom-class");
  });
});
