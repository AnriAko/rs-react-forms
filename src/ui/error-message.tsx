type ErrorMessageProps = {
  message?: unknown;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <p className="text-red-500 min-h-[1.25rem]">
    {typeof message === 'string'
      ? message
      : message instanceof Error
        ? message.message
        : '\u00A0'}
  </p>
);
