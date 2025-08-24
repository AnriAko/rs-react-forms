import { FormEvent, useState } from 'react';
import { useAppDispatch } from '~/redux/hooks';
import { addForm } from '~/redux/form-slice';
import { signupSchema } from '~/components/uncontrolled-form/uncontrolled-schema';
import { ErrorMessage } from '~/ui/error-message';
import { FormField } from '~/ui/form-field';
import { COUNTRIES } from '~/components/forms-config';
import { z } from 'zod';

export type FormData = z.infer<typeof signupSchema> & {
  pictureBase64?: string;
};

export default function UncontrolledForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawValues = Object.fromEntries(formData.entries());

    const fileInput = e.currentTarget.elements.namedItem(
      'picture'
    ) as HTMLInputElement;
    const pictureFile = fileInput.files?.[0];

    if (!pictureFile) {
      setErrors({ picture: 'File is required' });
      return;
    }

    const parsedValues: Omit<FormData, 'pictureBase64'> = {
      name: (rawValues.name as string) || '',
      age: rawValues.age ? Number(rawValues.age) : 0,
      email: (rawValues.email as string) || '',
      password: (rawValues.password as string) || '',
      confirmPassword: (rawValues.confirmPassword as string) || '',
      gender: (rawValues.gender as string) || '',
      country: (rawValues.country as string) || COUNTRIES[0],
      terms: rawValues.terms === 'on',
      picture: pictureFile,
    };

    const result = signupSchema.safeParse(parsedValues);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const form: FormData = { ...parsedValues };

    const reader = new FileReader();
    reader.onloadend = () => {
      form.pictureBase64 = reader.result as string;
      dispatch(addForm(form));
    };
    reader.readAsDataURL(pictureFile);

    e.currentTarget.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="uncontrolled-form"
      className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-md space-y-4"
    >
      <h2
        data-testid="form-title"
        className="text-2xl font-bold text-center text-gray-300 mb-4"
      >
        Sign Up Uncontrolled
      </h2>

      <FormField
        label="Name"
        name="name"
        id="field-name"
        error={errors.name}
        data-testid="field-name"
      />
      <FormField
        label="Age"
        name="age"
        id="field-age"
        type="number"
        error={errors.age}
        data-testid="field-age"
      />
      <FormField
        label="Email"
        name="email"
        id="field-email"
        type="email"
        error={errors.email}
        data-testid="field-email"
      />
      <FormField
        label="Password"
        name="password"
        id="field-password"
        type="password"
        error={errors.password}
        data-testid="field-password"
      />
      <FormField
        label="Confirm Password"
        name="confirmPassword"
        id="field-confirmPassword"
        type="password"
        error={errors.confirmPassword}
        data-testid="field-confirmPassword"
      />
      <FormField
        label="Gender"
        name="gender"
        id="field-gender"
        as="select"
        options={['Male', 'Female', '🍞', 'Other', 'Prefer not to say']}
        error={errors.gender}
        data-testid="field-gender"
      />
      <FormField
        label="Country"
        name="country"
        id="field-country"
        as="input"
        list="countries"
        error={errors.country}
        data-testid="field-country"
      />

      <datalist id="countries">
        {COUNTRIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <FormField
        label="Upload Picture"
        name="picture"
        id="field-picture"
        as="file"
        options={['image/png', 'image/jpeg']}
        error={errors.picture}
        data-testid="field-picture"
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="terms"
          id="terms"
          data-testid="field-terms"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-gray-300">
          Accept T&C
        </label>
      </div>
      <ErrorMessage message={errors.terms} data-testid="error-terms" />

      <button
        type="submit"
        data-testid="submit-button"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Submit
      </button>
    </form>
  );
}
