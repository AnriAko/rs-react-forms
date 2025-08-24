import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import ControlledForm from '~/components/controlled-form/controlled-form';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { formReducer } from '~/redux/form-slice';

class MockFileReader {
  result: string | null = null;
  onloadend: (() => void) | null = null;
  readAsDataURL() {
    this.result = 'data:image/png;base64,mock';
    if (this.onloadend) this.onloadend();
  }
}
vi.stubGlobal('FileReader', MockFileReader);

const renderWithStore = () => {
  const store = configureStore({ reducer: { forms: formReducer } });
  return {
    store,
    ...render(
      <Provider store={store}>
        <ControlledForm />
      </Provider>
    ),
  };
};

describe('ControlledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all fields', () => {
    renderWithStore();
    const fields = [
      'name',
      'age',
      'email',
      'password',
      'confirmPassword',
      'gender',
      'country',
      'picture',
      'terms',
    ];
    fields.forEach((f) =>
      expect(screen.getByTestId(`field-${f}`)).toBeInTheDocument()
    );
  });

  it('shows validation errors for invalid data', async () => {
    renderWithStore();

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'alice' },
    });
    fireEvent.change(screen.getByTestId('field-age'), {
      target: { value: '-5' },
    });
    fireEvent.change(screen.getByTestId('field-email'), {
      target: { value: 'bademail' },
    });
    fireEvent.change(screen.getByTestId('field-password'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByTestId('field-confirmPassword'), {
      target: { value: 'mismatch' },
    });
    fireEvent.change(screen.getByTestId('field-gender'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByTestId('field-country'), {
      target: { value: 'InvalidCountry' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      const errorMessages = screen.getAllByText(
        (content) => content.length > 0
      );
      expect(
        errorMessages.some((el) =>
          /Name must start/i.test(el.textContent || '')
        )
      ).toBe(true);
      expect(
        errorMessages.some((el) =>
          /Age must be non-negative/i.test(el.textContent || '')
        )
      ).toBe(true);
      expect(
        errorMessages.some((el) => /Invalid email/i.test(el.textContent || ''))
      ).toBe(true);
      expect(
        errorMessages.some((el) =>
          /Password too short/i.test(el.textContent || '')
        )
      ).toBe(true);
      expect(
        errorMessages.some((el) => /Select gender/i.test(el.textContent || ''))
      ).toBe(true);
      expect(
        errorMessages.some((el) =>
          /Select a valid country/i.test(el.textContent || '')
        )
      ).toBe(true);
      const confirmInput = screen.getByTestId('field-confirmPassword');
      const confirmError = confirmInput.nextElementSibling?.textContent || '';
      expect(confirmError.trim().length).toBeGreaterThanOrEqual(0);
    });
  });
});
