import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App baseline', () => {
  it('renders FlashMath title', () => {
    render(<App />);
    expect(screen.getByText('FlashMath')).toBeInTheDocument();
    expect(screen.getByText(/3-Minute Challenge/i)).toBeInTheDocument();
  });
});
