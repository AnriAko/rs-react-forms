import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const signupSchema = z
  .object({
    name: z
      .string()
      .regex(/^[A-Z][a-zA-Z]*$/, 'Name must start with uppercase'),
    age: z.coerce.number().min(0, 'Age must be non-negative'),
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
    terms: z
      .boolean()
      .refine((val) => val === true, { message: 'Must accept T&C' }),
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

type SignupFormData = z.infer<typeof signupSchema>;

export default function ControlledForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SignupFormData) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('Controlled form data:', {
        ...data,
        picture: reader.result,
      });
    };
    reader.readAsDataURL(data.picture);
    reset();
  };

  const ErrorMessage = ({ message }: { message?: string }) => (
    <p className="text-red-500 min-h-[1.25rem]">{message || '\u00A0'}</p>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
      <div>
        <label htmlFor="name">Name</label>
        <input {...register('name')} id="name" className="border p-2 w-full" />
        <ErrorMessage message={errors.name?.message as string} />
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          {...register('age')}
          id="age"
          type="number"
          className="border p-2 w-full"
        />
        <ErrorMessage message={errors.age?.message as string} />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          {...register('email')}
          id="email"
          className="border p-2 w-full"
        />
        <ErrorMessage message={errors.email?.message as string} />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          {...register('password')}
          id="password"
          type="password"
          className="border p-2 w-full"
        />
        <ErrorMessage message={errors.password?.message as string} />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          {...register('confirmPassword')}
          id="confirmPassword"
          type="password"
          className="border p-2 w-full"
        />
        <ErrorMessage message={errors.confirmPassword?.message as string} />
      </div>

      <div>
        <label htmlFor="gender">Gender</label>
        <select
          {...register('gender')}
          id="gender"
          className="border p-2 w-full"
        >
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <ErrorMessage message={errors.gender?.message as string} />
      </div>

      <div>
        <label htmlFor="picture">Upload Picture</label>
        <input
          {...register('picture')}
          id="picture"
          type="file"
          accept="image/png, image/jpeg"
          className="border p-2 w-full"
        />
        <ErrorMessage message={errors.picture?.message as string} />
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" {...register('terms')} id="terms" />
        <label htmlFor="terms">Accept T&C</label>
      </div>
      <ErrorMessage message={errors.terms?.message as string} />

      <button
        type="submit"
        disabled={!isValid}
        className="bg-blue-500 text-white px-4 py-2 disabled:bg-gray-400"
      >
        Submit
      </button>
    </form>
  );
}
