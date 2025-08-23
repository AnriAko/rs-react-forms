import { FormEvent, useState } from 'react';
import { signupSchema } from '~/components/signup-schema';
import { ErrorMessage } from '~/ui/error-message';
import { FormField } from '~/ui/form-field';
import { COUNTRIES } from '~/components/forms-config';

export default function UncontrolledForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const parsedValues = {
      ...values,
      age: Number(values.age),
      terms: formData.get('terms') === 'on',
      picture: formData.get('picture'),
    };

    const result = signupSchema.safeParse(parsedValues);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      });
      setErrors(newErrors);
    } else {
      setErrors({});
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Uncontrolled form data:', {
          ...result.data,
          picture: reader.result,
        });
      };
      if (parsedValues.picture instanceof File) {
        reader.readAsDataURL(parsedValues.picture);
      }
      e.currentTarget.reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-300 mb-4">
        Sign Up
      </h2>

      <FormField label="Name" name="name" error={errors.name} />
      <FormField label="Age" name="age" type="number" error={errors.age} />
      <FormField label="Email" name="email" type="email" error={errors.email} />
      <FormField
        label="Password"
        name="password"
        type="password"
        error={errors.password}
      />
      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        error={errors.confirmPassword}
      />
      <FormField
        label="Gender"
        name="gender"
        as="select"
        options={['Male', 'Female', '🍞', 'Other', 'Prefer not to say']}
        error={errors.gender}
      />
      <FormField
        label="Country"
        name="country"
        as="input"
        list="countries"
        error={errors.country}
      />
      <datalist id="countries">
        {COUNTRIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <FormField
        label="Upload Picture"
        name="picture"
        as="file"
        options={['image/png', 'image/jpeg']}
        error={errors.picture}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="terms"
          id="terms"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-gray-300">
          Accept T&C
        </label>
      </div>
      <ErrorMessage message={errors.terms} />

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Submit
      </button>
    </form>
  );
}
