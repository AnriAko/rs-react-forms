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
      .regex(/[0-9]/, 'Must include number')
      .regex(/[A-Z]/, 'Must include uppercase')
      .regex(/[a-z]/, 'Must include lowercase')
      .regex(/[^a-zA-Z0-9]/, 'Must include special character'),
    confirmPassword: z.string(),
    gender: z.string().nonempty('Select gender'),
    country: z.enum(
      COUNTRIES as [string, ...string[]],
      'Select a valid country'
    ),
    terms: z
      .boolean()
      .refine((val) => val === true, { message: 'Must accept T&C' }),
    picture: z
      .unknown()
      .refine(
        (files) => Array.isArray(files) && files.length === 1,
        'File is required'
      )
      .transform((files) => (files as FileList)[0])
      .refine(
        (file) => (file as File).size <= MAX_FILE_SIZE,
        'File size must be ≤ 5MB'
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes((file as File).type),
        'Only .png or .jpeg allowed'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });
