import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { Co2Data, YearlyData } from '~/types/co2';
import { formatNumber } from '~/utils/format-number';
import { SortField, SortOrder } from '~/types/filters';
import { CountriesFiltersMenu } from '~/components/countries-table-menu';

type Props = {
  data: Co2Data;
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
};

const CountriesTableComponent = ({
  data,
  selectedColumns,
  onColumnsChange,
}: Props) => {
  const [year, setYear] = useState<number>(2023);
  const [prevYear, setPrevYear] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    if (prevYear !== null && prevYear !== year) {
      const timeout = setTimeout(() => setPrevYear(null), 1000);
      return () => clearTimeout(timeout);
    }
  }, [year, prevYear]);

  const yearsList = useMemo(
    () =>
      Array.from(
        new Set(
          Object.values(data).flatMap((country) =>
            country.data.map((d) => d.year)
          )
        )
      ).sort((a, b) => b - a),
    [data]
  );

  const filteredAndSortedCountries = useMemo(() => {
    return Object.entries(data)
      .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
      .sort(([nameA, countryA], [nameB, countryB]) => {
        const rowA: YearlyData | undefined =
          countryA.data.find((d) => d.year === year) ||
          [...countryA.data].reverse()[0];
        const rowB: YearlyData | undefined =
          countryB.data.find((d) => d.year === year) ||
          [...countryB.data].reverse()[0];

        let valueA: string | number = 0;
        let valueB: string | number = 0;

        switch (sortField) {
          case 'name':
            valueA = nameA;
            valueB = nameB;
            break;
          case 'population':
            valueA = rowA?.population ?? 0;
            valueB = rowB?.population ?? 0;
            break;
          case 'co2':
            valueA = rowA?.co2 ?? 0;
            valueB = rowB?.co2 ?? 0;
            break;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortOrder === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        return sortOrder === 'asc'
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      });
  }, [data, year, search, sortField, sortOrder]);

  const handleFiltersChange = useCallback(
    (filters: {
      year: number;
      search: string;
      sortField: SortField;
      sortOrder: SortOrder;
    }) => {
      setPrevYear(year);
      setYear(filters.year);
      setSearch(filters.search);
      setSortField(filters.sortField);
      setSortOrder(filters.sortOrder);
    },
    [year]
  );

  return (
    <div>
      <CountriesFiltersMenu
        year={year}
        yearsList={yearsList}
        search={search}
        sortField={sortField}
        sortOrder={sortOrder}
        onChange={handleFiltersChange}
        selectedColumns={selectedColumns}
        onColumnsChange={onColumnsChange}
      />

      <table className="w-full border-collapse border mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Country</th>
            <th className="border p-2 text-left">ISO</th>
            <th className="border p-2 text-right">Population</th>
            <th className="border p-2 text-right">CO₂ (Mt)</th>
            <th className="border p-2 text-right">CO₂ per capita (t)</th>
            {selectedColumns.map((col) => (
              <th key={col} className="border p-2 text-right">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedCountries.map(([name, country]) => {
            const rowData: YearlyData | undefined =
              country.data.find((d) => d.year === year) ||
              [...country.data].reverse()[0];

            const isUpdated = prevYear !== null && prevYear !== year;

            return (
              <tr
                key={name}
                className={`hover:bg-gray-50 transition-colors duration-500 ${
                  isUpdated ? 'bg-yellow-100' : ''
                }`}
              >
                <td className="border p-2">{name}</td>
                <td className="border p-2">{country.iso_code ?? 'N/A'}</td>
                <td className="border p-2 text-right">
                  {formatNumber(rowData?.population)}
                </td>
                <td className="border p-2 text-right">
                  {formatNumber(rowData?.co2, 2)}
                </td>
                <td className="border p-2 text-right">
                  {formatNumber(rowData?.co2_per_capita, 2)}
                </td>
                {selectedColumns.map((col) => (
                  <td key={col} className="border p-2 text-right">
                    {formatNumber(rowData?.[col as keyof YearlyData]) ?? 'N/A'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const CountriesTable = memo(CountriesTableComponent);
