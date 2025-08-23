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
      picture: formData.getAll('picture'),
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
      reader.readAsDataURL(result.data.picture);
      e.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
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
        options={['Male', 'Female', 'Bread', 'Other', 'Prefer not to say']}
        error={errors.gender}
      />
      <FormField
        label="Country"
        name="country"
        as="input"
        error={errors.country}
        list="countries"
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
        <input type="checkbox" name="terms" id="terms" />
        <label htmlFor="terms">Accept T&C</label>
      </div>
      <ErrorMessage message={errors.terms} />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Submit
      </button>
    </form>
  );
}
