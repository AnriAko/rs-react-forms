// FormField.tsx
import { UseFormRegisterReturn } from 'react-hook-form';
import { ErrorMessage } from '~/ui/error-message';
import cl from 'classnames';

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
}: FieldProps<T>) => {
  const baseStyles =
    'border rounded-md p-2 w-full text-gray-300 bg-gray-800 focus:outline-none';
  const focusStyles = error
    ? 'focus:ring-2 focus:ring-red-500'
    : 'focus:ring-2 focus:ring-yellow-400';
  const borderStyles = error ? 'border-red-500' : 'border-gray-400';

  const inputClass = cl(baseStyles, focusStyles, borderStyles);

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name as string}
        className="mb-1 font-medium text-gray-300"
      >
        {label}
      </label>

      {as === 'input' && (
        <input
          id={name as string}
          type={type}
          className={inputClass}
          {...register}
          {...(list ? { list } : {})}
        />
      )}

      {as === 'select' && (
        <select id={name as string} className={inputClass} {...register}>
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
          className={inputClass}
          accept={options.join(',')}
          {...register}
        />
      )}

      <ErrorMessage message={error} />
    </div>
  );
};
