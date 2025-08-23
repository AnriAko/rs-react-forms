type ErrorMessageProps = {
  message?: unknown;
  className?: string;
};

export const ErrorMessage = ({ message, className }: ErrorMessageProps) => (
  <p className={`${className || 'text-red-500 min-h-[1.25rem]'}`}>
    {typeof message === 'string'
      ? message
      : message instanceof Error
        ? message.message
        : '\u00A0'}
  </p>
);
