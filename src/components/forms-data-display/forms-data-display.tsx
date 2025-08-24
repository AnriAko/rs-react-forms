import { useAppSelector } from '~/redux/hooks';
import { signupSchema } from '~/components/controlled-form/controlled-schema';
import { z } from 'zod';

type FormData = z.infer<typeof signupSchema> & { pictureBase64?: string };

export const FormsDisplay = () => {
  const forms = useAppSelector((state) => state.forms.forms);

  const renderCard = (form: FormData, idx: number) => (
    <div
      key={idx}
      className={`p-3 rounded-lg shadow-md border transition-all duration-500 text-gray-200 ${
        idx === 0
          ? 'border-yellow-400 bg-gray-700'
          : 'border-gray-600 bg-gray-800'
      }`}
    >
      <p>
        <strong>Name:</strong> {form.name}
      </p>
      <p>
        <strong>Age:</strong> {form.age}
      </p>
      <p>
        <strong>Email:</strong> {form.email}
      </p>
      <p>
        <strong>Gender:</strong> {form.gender}
      </p>
      <p>
        <strong>Country:</strong> {form.country}
      </p>
      <p>
        <strong>T&C:</strong> {form.terms ? 'Accepted' : 'Not accepted'}
      </p>
      {form.pictureBase64 && (
        <img
          src={form.pictureBase64}
          alt="Uploaded"
          className="mt-2 max-w-[150px] max-h-[150px] rounded"
        />
      )}
    </div>
  );

  const reversedForms = [...forms].reverse();

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <h2 className="text-lg font-semibold mb-2 col-span-2 text-gray-200">
        Submitted Forms:
      </h2>
      <div className="col-span-2 space-y-2">
        {reversedForms.map((form, idx) => renderCard(form, idx))}
      </div>
    </div>
  );
};
