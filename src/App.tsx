import { useState } from 'react';
import Modal from '~/components/modal/modal';
import ControlledForm from '~/components/controlled-form/controlled-form';
import UncontrolledForm from '~/components/uncontrolled-form/uncontrolled-form';

const App = () => {
  const [openForm, setOpenForm] = useState<
    'controlled' | 'uncontrolled' | null
  >(null);

  return (
    <div className="bg-gray-700 text-white min-h-screen p-6">
      <h1 className="text-2xl mb-4">My App</h1>

      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          onClick={() => setOpenForm('controlled')}
        >
          Open Controlled Form
        </button>
        <button
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
          onClick={() => setOpenForm('uncontrolled')}
        >
          Open Uncontrolled Form
        </button>
      </div>

      <Modal
        isOpen={openForm === 'controlled'}
        onClose={() => setOpenForm(null)}
      >
        <ControlledForm />
      </Modal>

      <Modal
        isOpen={openForm === 'uncontrolled'}
        onClose={() => setOpenForm(null)}
      >
        <UncontrolledForm />
      </Modal>
    </div>
  );
};

export default App;
