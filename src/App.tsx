import { Suspense } from 'react';
import { DataView } from '~/components/data-view';
import { Loader } from '~/components/loader';

export default function App() {
  return (
    <div className="p-5">
      <Suspense fallback={<Loader />}>
        <DataView />
      </Suspense>
    </div>
  );
}
