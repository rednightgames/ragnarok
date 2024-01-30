import "@testing-library/jest-dom";

import {fireEvent, render, screen} from "@testing-library/react";

import Checkbox from "./Checkbox";

describe("Checkbox component", () => {
  test("renders checkbox correctly", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("renders with custom label text", () => {
    render(<Checkbox>Custom Label</Checkbox>);
    const label = screen.getByText("Custom Label");
    expect(label).toBeInTheDocument();
  });

  test("handles onChange event", () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");
    
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalled();
  });

  test("applies styles correctly", () => {
    render(
      <Checkbox
        color="#ff0000"
        backgroundColor="#00ff00"
        borderColor="#0000ff"
        data-testid="checkbox"
      />,
    );
    const checkbox = screen.getByTestId("checkbox-span");

    expect(checkbox).toHaveStyle({
      color: "#ff0000",
      background: "#00ff00",
      borderColor: "#0000ff",
    });
  });

  // Add more test cases as needed for your specific use cases
});
