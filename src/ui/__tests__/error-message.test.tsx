import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorMessage } from '~/ui/error-message';

describe('ErrorMessage', () => {
  it('renders string message', () => {
    render(<ErrorMessage message="Error occurred" />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('renders Error object message', () => {
    render(<ErrorMessage message={new Error('Something went wrong')} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders non-string/non-Error as nbsp', () => {
    render(<ErrorMessage message={123} />);
    const p = screen.getByText((content, element) => element?.tagName === 'P');
    expect(p?.textContent).toBe('\u00A0');
  });

  it('renders empty space when message is not provided', () => {
    render(<ErrorMessage />);
    const p = screen.getByText((content, element) => element?.tagName === 'P');
    expect(p?.textContent).toBe('\u00A0');
  });
});
