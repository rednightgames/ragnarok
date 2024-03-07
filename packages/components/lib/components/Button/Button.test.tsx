import "@testing-library/jest-dom";

import {fireEvent, render, screen} from "@testing-library/react";

import Button from "./Button";

describe("Button Component", () => {
  it("renders button with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("renders button with loading state", () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("handles button click", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders disabled button", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("renders button with custom class", () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("renders button with custom size", () => {
    render(<Button size="large">Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("button-large");
  });

  it("renders button with custom shape and color", () => {
    render(
      <Button shape="ghost" color="secondary">
        Click me
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("button-ghost-secondary");
  });
});
