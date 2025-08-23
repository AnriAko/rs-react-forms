import { UseFormRegisterReturn } from 'react-hook-form';
import { ErrorMessage } from '~/ui/error-message';

type FieldProps<T> = {
  label: string;
  name: keyof T;
  type?: string;
  as?: 'input' | 'select' | 'file';
  options?: string[];
  register?: UseFormRegisterReturn;
  error?: string;
  list?: string;
};

export const FormField = <T,>({
  label,
  name,
  type = 'text',
  as = 'input',
  options = [],
  register,
  error,
  list,
}: FieldProps<T>) => (
  <div>
    <label htmlFor={name as string}>{label}</label>
    {as === 'input' && (
      <input
        id={name as string}
        type={type}
        className="border p-2 w-full"
        {...register}
        {...(list ? { list } : {})}
      />
    )}
    {as === 'select' && (
      <select id={name as string} className="border p-2 w-full" {...register}>
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    )}
    {as === 'file' && (
      <input
        id={name as string}
        type="file"
        className="border p-2 w-full"
        accept={options.join(',')}
        {...register}
      />
    )}
    <ErrorMessage message={error} />
  </div>
);
