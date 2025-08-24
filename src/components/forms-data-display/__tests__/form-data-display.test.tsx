import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormsDisplay } from '~/components/forms-data-display/forms-data-display';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { formReducer, FormState } from '~/redux/form-slice';

const renderWithStore = (state: FormState) => {
  const store = configureStore({
    reducer: { forms: formReducer },
    preloadedState: { forms: state },
  });

  return render(
    <Provider store={store}>
      <FormsDisplay />
    </Provider>
  );
};

describe('FormsDisplay', () => {
  it('renders "Submitted Forms" heading', () => {
    renderWithStore({ forms: [], countries: [] });
    expect(screen.getByText(/Submitted Forms:/i)).toBeInTheDocument();
  });

  it('renders multiple forms in reverse order', () => {
    const forms = [
      {
        name: 'Alice',
        age: 22,
        email: 'alice@example.com',
        password: 'alice1234',
        confirmPassword: 'alice1234',
        gender: 'Female',
        country: 'USA',
        terms: true,
        picture: new File([''], 'alice.png', { type: 'image/png' }),
      },
      {
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        password: 'bob1234',
        confirmPassword: 'bob1234',
        gender: 'Male',
        country: 'Germany',
        terms: false,
        picture: new File([''], 'bob.png', { type: 'image/png' }),
      },
    ];
    renderWithStore({ forms, countries: [] });

    const nameElements = screen.getAllByText(/Name:/i);
    expect(nameElements[0].parentElement).toHaveTextContent('Bob');
    expect(nameElements[1].parentElement).toHaveTextContent('Alice');
  });

  it('renders pictureBase64 when provided', () => {
    const forms = [
      {
        name: 'Charlie',
        age: 28,
        email: 'charlie@example.com',
        password: 'charlie1234',
        confirmPassword: 'charlie1234',
        gender: 'Male',
        country: 'France',
        terms: true,
        picture: new File([''], 'charlie.png', { type: 'image/png' }),
        pictureBase64: 'data:image/png;base64,abc',
      },
    ];
    renderWithStore({ forms, countries: [] });

    const img = screen.getByAltText('Uploaded') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('data:image/png;base64,abc');
  });

  it('renders T&C status correctly', () => {
    const forms = [
      {
        name: 'Dana',
        age: 35,
        email: 'dana@example.com',
        password: 'dana1234',
        confirmPassword: 'dana1234',
        gender: 'Female',
        country: 'Italy',
        terms: true,
        picture: new File([''], 'dana.png', { type: 'image/png' }),
      },
      {
        name: 'Eve',
        age: 27,
        email: 'eve@example.com',
        password: 'eve1234',
        confirmPassword: 'eve1234',
        gender: 'Female',
        country: 'Spain',
        terms: false,
        picture: new File([''], 'eve.png', { type: 'image/png' }),
      },
    ];
    renderWithStore({ forms, countries: [] });

    const tcElements = screen.getAllByText(/T&C:/i);
    expect(tcElements[0].parentElement).toHaveTextContent('Not accepted');
    expect(tcElements[1].parentElement).toHaveTextContent('Accepted');
  });
});
