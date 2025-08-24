import ControlledForm from '~/components/controlled-form/controlled-form';
import UncontrolledForm from '~/components/uncontrolled-form/uncontrolled-form';

const App = () => {
  return (
    <div className="bg-gray-700 text-white">
      My App
      <ControlledForm />
      <UncontrolledForm />
    </div>
  );
};

export default App;
