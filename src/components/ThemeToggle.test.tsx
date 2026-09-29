import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

const TestComponent = () => {
  const { theme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <ThemeToggle />
    </div>
  );
};

describe('ThemeToggle & ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.clearAllMocks();
  });

  it('renders with default light mode when localStorage is empty and system prefers light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(screen.getByRole('button', { name: /switch to chalkboard dark mode/i })).toBeInTheDocument();
  });

  it('toggles to chalkboard dark mode and adds dark class to documentElement', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /switch to chalkboard dark mode/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('flashmath_theme')).toBe('dark');

    // Button updates label to switch back to paper light mode
    expect(screen.getByRole('button', { name: /switch to paper light mode/i })).toBeInTheDocument();

    // Toggle back to light mode
    fireEvent.click(screen.getByRole('button', { name: /switch to paper light mode/i }));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('flashmath_theme')).toBe('light');
  });

  it('respects existing dark mode preference stored in localStorage', () => {
    localStorage.setItem('flashmath_theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button', { name: /switch to paper light mode/i })).toBeInTheDocument();
  });
});
