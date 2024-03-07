import "@testing-library/jest-dom";

import {fireEvent, render, screen} from "@testing-library/react";

import Radio from "./Radio";

describe("Radio component tests", () => {
  it("renders Radio component correctly", () => {
    const {getByLabelText} = render(
      <Radio id="radioId" name="radioName">
        Radio Label
      </Radio>,
    );

    const radioInput = getByLabelText("Radio Label");
    expect(radioInput).toBeInTheDocument();
    expect(radioInput).toHaveAttribute("type", "radio");
  });

  it("applies custom class correctly", () => {
    render(
      <Radio id="radio" name="radioName" className="custom-class">
        Radio Label
      </Radio>,
    );

    const labelElement = screen.getByTestId("radio-label");
    expect(labelElement).toHaveClass("custom-class");
  });

  it("handles disabled state correctly", () => {
    render(
      <Radio id="radioId" name="radioName" disabled>
        Radio Label
      </Radio>,
    );

    const radioInput = screen.getByTestId("radio-input");
    expect(radioInput).toBeDisabled();
  });

  it("fires onChange event correctly", () => {
    const handleChange = vi.fn();

    render(
      <Radio id="radioId" name="radioName" onChange={handleChange}>
        Radio Label
      </Radio>,
    );

    const radioInput = screen.getByTestId("radio-input");
    fireEvent.click(radioInput);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
