import { FormEvent, useState } from 'react';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const countries = ['Poland', 'Germany', 'France', 'Spain', 'USA', 'Canada'];

const schema = z
  .object({
    name: z
      .string()
      .regex(/^[A-Z][a-zA-Z]*$/, 'Name must start with uppercase'),
    age: z
      .string()
      .regex(/^\d+$/, 'Age must be a number')
      .transform(Number)
      .refine((val) => val >= 0, 'Age must be non-negative'),
    email: z.email('Invalid email'),
    password: z
      .string()
      .min(6, 'Password too short')
      .regex(/[0-9]/, 'Must include number')
      .regex(/[A-Z]/, 'Must include uppercase')
      .regex(/[a-z]/, 'Must include lowercase')
      .regex(/[^a-zA-Z0-9]/, 'Must include special character'),
    confirmPassword: z.string().min(6),
    gender: z.string().nonempty('Select gender'),
    terms: z.literal('on', { message: 'Must accept T&C' }),
    country: z.string().nonempty('Select country'),
    picture: z
      .any()
      .refine((files) => files?.length === 1, 'File is required')
      .transform((files) => files[0] as File)
      .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be ≤ 5MB')
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Only .png or .jpeg allowed'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });
const ErrorMessage = ({ message }: { message?: string }) => (
  <p className="text-red-500 min-h-[1.25rem]">{message || '\u00A0'}</p>
);

export default function UncontrolledForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredCountries, setFilteredCountries] = useState(countries);

  const handleCountryChange = (value: string) => {
    const lower = value.toLowerCase();
    setFilteredCountries(
      countries.filter((c) => c.toLowerCase().includes(lower))
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const result = schema.safeParse({
      ...values,
      picture: formData.getAll('picture'),
    });

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
      <div>
        <label htmlFor="name">Name</label>
        <input name="name" id="name" className="border p-2 w-full" />
        <ErrorMessage message={errors.name} />
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input name="age" id="age" className="border p-2 w-full" />
        <ErrorMessage message={errors.age} />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input name="email" id="email" className="border p-2 w-full" />
        <ErrorMessage message={errors.email} />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          name="password"
          id="password"
          type="password"
          className="border p-2 w-full"
        />
        <ErrorMessage message={errors.password} />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          className="border p-2 w-full"
        />
        <ErrorMessage message={errors.confirmPassword} />
      </div>

      <div>
        <label htmlFor="gender">Gender</label>
        <select name="gender" id="gender" className="border p-2 w-full">
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <ErrorMessage message={errors.gender} />
      </div>

      <div>
        <label htmlFor="country">Country</label>
        <input
          name="country"
          id="country"
          list="countries"
          className="border p-2 w-full"
          onChange={(e) => handleCountryChange(e.target.value)}
        />
        <datalist id="countries">
          {filteredCountries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <ErrorMessage message={errors.country} />
      </div>

      <div>
        <label htmlFor="picture">Upload Picture</label>
        <input
          type="file"
          name="picture"
          id="picture"
          accept="image/png, image/jpeg"
          className="border p-2 w-full"
        />
        <ErrorMessage message={errors.picture} />
      </div>

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
