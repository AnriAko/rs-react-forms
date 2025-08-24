import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '~/components/controlled-form/controlled-schema';
import { FormField } from '~/ui/form-field';
import { ErrorMessage } from '~/ui/error-message';
import { COUNTRIES } from '~/components/forms-config';
import { z } from 'zod';
import { useAppDispatch } from '~/redux/hooks';
import { addForm } from '~/redux/form-slice';
import { useEffect } from 'react';

type SignupFormData = z.infer<typeof signupSchema>;

type ControlledFormProps = {
  onClose?: () => void;
};

export default function ControlledForm({ onClose }: ControlledFormProps) {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  useEffect(() => {
    if (passwordValue || confirmPasswordValue) {
      if (passwordValue !== confirmPasswordValue) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords must match',
        });
      } else {
        clearErrors('confirmPassword');
      }
    } else {
      clearErrors('confirmPassword');
    }
  }, [passwordValue, confirmPasswordValue, setError, clearErrors]);

  const onSubmit = (data: SignupFormData) => {
    if (data.picture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(addForm({ ...data, pictureBase64: reader.result as string }));
        reset();
        onClose?.();
      };
      reader.readAsDataURL(data.picture);
    } else {
      dispatch(addForm(data));
      reset();
      onClose?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-300 mb-4">
        Sign Up Controlled
      </h2>

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
        options={['Male', 'Female', '🍞', 'Other', 'Prefer not to say']}
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
        <input
          type="checkbox"
          {...register('terms')}
          id="terms"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-gray-300">
          Accept T&C
        </label>
      </div>
      <ErrorMessage message={errors.terms?.message} />

      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:bg-gray-400"
      >
        Submit
      </button>
    </form>
  );
}
