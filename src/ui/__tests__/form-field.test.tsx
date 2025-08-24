import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormField } from '~/ui/form-field';

describe('FormField', () => {
  it('renders input field with label', () => {
    render(<FormField label="Name" name="name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('type', 'text');
  });

  it('renders input with type password', () => {
    render(<FormField label="Password" name="password" type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    );
  });

  it('renders select with options', () => {
    const options = ['USA', 'Germany', 'France'];
    render(
      <FormField label="Country" name="country" as="select" options={options} />
    );

    const select = screen.getByLabelText('Country');
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe('SELECT');
    options.forEach((opt) => {
      expect(screen.getByRole('option', { name: opt })).toBeInTheDocument();
    });
  });

  it('renders file input with accept attribute', () => {
    const options = ['image/png', 'image/jpeg'];
    render(
      <FormField label="Picture" name="picture" as="file" options={options} />
    );

    const input = screen.getByLabelText('Picture');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/png,image/jpeg');
  });

  it('displays error message', () => {
    render(<FormField label="Email" name="email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('applies correct classes when error exists', () => {
    render(<FormField label="Email" name="email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveClass('focus:ring-2 focus:ring-red-500');
  });

  it('calls register function if provided', () => {
    const registerMock = {
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
      name: 'name',
    };

    render(<FormField label="Name" name="name" register={registerMock} />);

    const input = screen.getByLabelText('Name');

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.blur(input);

    expect(registerMock.onChange).toHaveBeenCalled();
    expect(registerMock.onBlur).toHaveBeenCalled();
  });
});
