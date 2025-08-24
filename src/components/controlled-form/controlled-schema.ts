import { z } from 'zod';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  COUNTRIES,
} from '~/components/forms-config';

export const signupSchema = z
  .object({
    name: z
      .string()
      .regex(
        /^\p{Lu}[\p{L}\p{M}]*$/u,
        'Name must start with an uppercase letter'
      ),
    age: z.coerce.number().min(0, 'Age must be non-negative'),
    email: z.email('Invalid email'),
    password: z
      .string()
      .min(6, 'Password too short')
      .regex(/\p{N}/u, 'Must include number')
      .regex(/\p{Lu}/u, 'Must include uppercase letter')
      .regex(/\p{Ll}/u, 'Must include lowercase letter')
      .regex(/[^\p{L}\p{N}]/u, 'Must include special character'),
    confirmPassword: z.string(),
    gender: z.string().nonempty('Select gender'),
    country: z.enum(
      COUNTRIES as [string, ...string[]],
      'Select a valid country'
    ),
    terms: z
      .boolean()
      .refine((val) => val === true, { message: 'Must accept T&C' }),
    picture: z.preprocess(
      (val) => (val instanceof FileList && val.length === 1 ? val[0] : val),
      z
        .instanceof(File, { message: 'File is required' })
        .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be ≤ 5MB')
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          'Only .png or .jpeg allowed'
        )
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });
