import { UseFormRegisterReturn } from 'react-hook-form';
import { ErrorMessage } from '~/ui/error-message';
import cl from 'classnames';

type FieldProps<T> = {
  label: string;
  name: keyof T;
  id?: string;
  type?: string;
  as?: 'input' | 'select' | 'file';
  options?: string[];
  register?: UseFormRegisterReturn;
  error?: string;
  list?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.SelectHTMLAttributes<HTMLSelectElement>;

export const FormField = <T,>({
  label,
  name,
  id,
  type = 'text',
  as = 'input',
  options = [],
  register,
  error,
  list,
  ...rest
}: FieldProps<T>) => {
  const baseStyles =
    'border rounded-md p-2 w-full text-gray-300 bg-gray-800 focus:outline-none';
  const focusStyles = error
    ? 'focus:ring-2 focus:ring-red-500'
    : 'focus:ring-2 focus:ring-yellow-400';
  const borderStyles = error ? 'border-red-500' : 'border-gray-400';

  const inputClass = cl(baseStyles, focusStyles, borderStyles);
  const fieldId = id || `field-${name as string}`;

  return (
    <div className="flex flex-col">
      <label htmlFor={fieldId} className="mb-1 font-medium text-gray-300">
        {label}
      </label>

      {as === 'input' && (
        <input
          id={fieldId}
          name={name as string}
          type={type}
          className={inputClass}
          {...register}
          {...(list ? { list } : {})}
          {...rest}
        />
      )}

      {as === 'select' && (
        <select
          id={fieldId}
          name={name as string}
          className={inputClass}
          {...register}
          {...rest}
        >
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
          id={fieldId}
          name={name as string}
          type="file"
          className={inputClass}
          accept={options.join(',')}
          {...register}
          {...rest}
        />
      )}

      <ErrorMessage message={error} />
    </div>
  );
};
