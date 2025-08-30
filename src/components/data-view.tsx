import { useState } from 'react';
import { useGetCo2 } from '~/hooks/use-get-co2';
import { CountriesTable } from '~/components/countries-table';

export function DataView() {
  const data = useGetCo2();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">CO₂ Emissions Dashboard</h1>
      <CountriesTable
        data={data}
        selectedColumns={selectedColumns}
        onColumnsChange={setSelectedColumns}
      />
    </div>
  );
}
