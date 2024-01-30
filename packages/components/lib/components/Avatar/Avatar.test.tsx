import {render, screen} from '@testing-library/react';
import "@testing-library/jest-dom";
import Avatar from './Avatar';

// Mock the react-polymorphic-types module
vi.mock('@rednight/react-polymorphic-types', () => ({
  PolymorphicPropsWithRef: vi.fn(),
}));

describe('Avatar Component', () => {
  it('renders with provided src and fallback', () => {
    const src = 'path/to/avatar.png';
    const fallback = 'F';
    render(<Avatar src={src} fallback={fallback} />);
    const avatarImage = screen.getByAltText(fallback);
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', src);
    const avatarFallback = screen.getByText(fallback);
    expect(avatarFallback).toBeInTheDocument();
  });

  it('renders with default size if size prop is not provided', () => {
    const src = 'path/to/avatar.png';
    const fallback = 'F';
    render(<Avatar src={src} fallback={fallback} data-testid="avatar" />);
    const avatarProvider = screen.getByTestId('avatar');
    expect(avatarProvider).toHaveStyle('--avatar-size: medium');
  });

  it('renders with provided size', () => {
    const src = 'path/to/avatar.png';
    const fallback = 'F';
    const size = 'large';
    render(<Avatar src={src} fallback={fallback} size={size} data-testid="avatar" />);
    const avatarProvider = screen.getByTestId('avatar');
    expect(avatarProvider).toHaveStyle(`--avatar-size: ${size}`);
  });

  it('renders with default color if fallback is not provided', () => {
    const src = 'path/to/avatar.png';
    render(<Avatar src={src} data-testid="avatar" />);
    const avatarProvider = screen.getByTestId('avatar');
    expect(avatarProvider).toHaveStyle('--avatar-color: var(--primary)');
  });

  it('renders with generated color based on fallback', () => {
    const src = 'path/to/avatar.png';
    const fallback = 'F';
    render(<Avatar src={src} fallback={fallback} data-testid="avatar" />);
    const avatarProvider = screen.getByTestId('avatar');
    expect(avatarProvider).toHaveStyle(`--avatar-color: #3b5998`);
  });
});
