import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import UncontrolledForm, {
  FormData,
} from '~/components/uncontrolled-form/uncontrolled-form';
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
        <UncontrolledForm />
      </Provider>
    ),
  };
};

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.remove();
  });

  it('renders all fields', () => {
    renderWithStore();
    const fields = [
      'field-name',
      'field-age',
      'field-email',
      'field-password',
      'field-confirmPassword',
      'field-gender',
      'field-country',
      'field-picture',
      'field-terms',
      'submit-button',
    ];
    fields.forEach((f) => expect(screen.getByTestId(f)).toBeInTheDocument());
  });

  it('shows error if picture is not uploaded', async () => {
    renderWithStore();
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByText(/File is required/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    const { store } = renderWithStore();
    const file = new File(['dummy'], 'pic.png', { type: 'image/png' });

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Alice' },
    });
    fireEvent.change(screen.getByTestId('field-age'), {
      target: { value: '25' },
    });
    fireEvent.change(screen.getByTestId('field-email'), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.change(screen.getByTestId('field-password'), {
      target: { value: 'Alice1!' },
    });
    fireEvent.change(screen.getByTestId('field-confirmPassword'), {
      target: { value: 'Alice1!' },
    });
    fireEvent.change(screen.getByTestId('field-gender'), {
      target: { value: 'Female' },
    });
    fireEvent.change(screen.getByTestId('field-country'), {
      target: { value: 'USA' },
    });
    fireEvent.change(screen.getByTestId('field-picture'), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByTestId('field-terms'));

    fireEvent.submit(screen.getByTestId('uncontrolled-form'));

    await waitFor(() => {
      const state = store.getState();
      expect(state.forms.forms.length).toBe(1);
      const saved: FormData = state.forms.forms[0];
      expect(saved.name).toBe('Alice');
      expect(saved.pictureBase64).toBe('data:image/png;base64,mock');
    });
  });

  it('shows validation errors for invalid data', async () => {
    renderWithStore();

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'alice' },
    });
    fireEvent.change(screen.getByTestId('field-password'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByTestId('field-confirmPassword'), {
      target: { value: 'mismatch' },
    });

    const file = new File(['dummy'], 'pic.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('field-picture'), {
      target: { files: [file] },
    });

    fireEvent.submit(screen.getByTestId('uncontrolled-form'));

    await waitFor(async () => {
      expect(
        screen.getByText(/Name must start with an uppercase letter/i)
      ).toBeInTheDocument();

      const passwordInput = screen.getByTestId('field-password');
      expect(passwordInput.nextElementSibling?.textContent).toMatch(
        /Must include/i
      );

      const confirmInput = screen.getByTestId('field-confirmPassword');
      await waitFor(() => {
        expect(confirmInput.nextElementSibling?.textContent).not.toBe('');
      });
    });
  });
});
