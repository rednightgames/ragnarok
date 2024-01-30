import "@testing-library/jest-dom";

import {render, screen, waitFor} from "@testing-library/react";

import Avatar from "./Avatar";

// Mock the react-polymorphic-types module
vi.mock("@rednight/react-polymorphic-types", () => ({
  PolymorphicPropsWithRef: vi.fn(),
}));

beforeAll(() => {
  global.Image = class {
    [x: string]: any;
    constructor() {
      setTimeout(() => {
        this.onload();
      }, 100);
    }
  } as any;
});

describe("Avatar Component", () => {
  it("renders with provided good src", async () => {
    const src = "https://cdn.rednightgames.com/avatars/good";
    const fallback = "F";

    render(
      <Avatar
        src={src}
        fallback={fallback}
        data-testid="avatar"
      />,
    );

    const avatarFallback = screen.getByText(fallback);
    expect(avatarFallback).toBeInTheDocument();

    await waitFor(() => {
      const avatarImage = screen.getByAltText(fallback);
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage).toHaveAttribute("src", src);
    });
  });

  it("renders with provided bad src", () => {
    const src = "https://cdn.rednightgames.com/avatars/bad";
    const fallback = "F";

    render(
      <Avatar
        src={src}
        fallback={fallback}
        data-testid="avatar"
      />,
    );

    const avatarFallback = screen.getByTestId("avatar-fallback");
    expect(avatarFallback).toBeInTheDocument();
  });

  it("renders with default size if size prop is not provided", () => {
    const src = "https://cdn.rednightgames.com/avatars/130338604252660200";
    const fallback = "F";

    render(
      <Avatar
        src={src}
        fallback={fallback}
        data-testid="avatar"
      />,
    );

    const avatarProvider = screen.getByTestId("avatar-provider");
    expect(avatarProvider).not.toHaveStyle("--avatar-size: small");
    expect(avatarProvider).not.toHaveStyle("--avatar-size: large");
  });

  it("renders with provided size", () => {
    const src = "path/to/avatar.png";
    const fallback = "F";
    const size = "large";

    render(
      <Avatar
        src={src}
        fallback={fallback}
        size={size}
        data-testid="avatar"
      />,
    );

    const avatarProvider = screen.getByTestId("avatar-provider");
    expect(avatarProvider).toHaveClass(`avatar-${size}`);
  });

  it("renders with default color if fallback is not provided", () => {
    const src = "path/to/avatar.png";

    render(
      <Avatar
        src={src}
        data-testid="avatar"
      />,
    );

    const avatarProvider = screen.getByTestId("avatar-provider");
    expect(avatarProvider).toHaveStyle("--avatar-color: var(--primary)");
  });

  it("renders with generated color based on fallback", () => {
    const src = "path/to/avatar.png";
    const fallback = "F";

    render(
      <Avatar
        src={src}
        fallback={fallback}
        data-testid="avatar"
      />,
    );
    
    const avatarProvider = screen.getByTestId("avatar-provider");
    expect(avatarProvider).toHaveStyle(`--avatar-color: #460000`);
  });
});
