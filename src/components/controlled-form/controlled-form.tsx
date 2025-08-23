import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '~/components/signup-schema';
import { FormField } from '~/ui/form-field';
import { ErrorMessage } from '~/ui/error-message';
import { COUNTRIES } from '~/components/forms-config';
import { z } from 'zod';

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
      console.log('Controlled form data:', { ...data, picture: reader.result });
    };
    reader.readAsDataURL(data.picture);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
      <FormField<SignupFormData>
        label="Name"
        name="name"
        register={register('name')}
        error={errors.name?.message}
      />
      <FormField<SignupFormData>
        label="Age"
        name="age"
        type="number"
        register={register('age')}
        error={errors.age?.message}
      />
      <FormField<SignupFormData>
        label="Email"
        name="email"
        type="email"
        register={register('email')}
        error={errors.email?.message}
      />
      <FormField<SignupFormData>
        label="Password"
        name="password"
        type="password"
        register={register('password')}
        error={errors.password?.message}
      />
      <FormField<SignupFormData>
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        register={register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <FormField<SignupFormData>
        label="Gender"
        name="gender"
        as="select"
        options={['Male', 'Female', 'Bread', 'Other', 'Prefer not to say']}
        register={register('gender')}
        error={errors.gender?.message}
      />

      <FormField<SignupFormData>
        label="Country"
        name="country"
        as="input"
        list="countries"
        register={register('country')}
        error={errors.country?.message}
      />
      <datalist id="countries">
        {COUNTRIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <FormField<SignupFormData>
        label="Upload Picture"
        name="picture"
        as="file"
        options={['image/png', 'image/jpeg']}
        register={register('picture')}
        error={errors.picture?.message as string}
      />

      <div className="flex items-center space-x-2">
        <input type="checkbox" {...register('terms')} id="terms" />
        <label htmlFor="terms">Accept T&C</label>
      </div>
      <ErrorMessage message={errors.terms?.message} />

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
