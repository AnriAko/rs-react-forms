import { useState, useCallback, memo } from 'react';
import { SortField, SortOrder } from '~/types/filters';
import { ColumnsModal } from '~/components/columns-modal';

const allExtraColumns = ['methane', 'oil_co2', 'temperature_change_from_co2'];

export const CountriesFiltersMenu = memo(function CountriesFiltersMenu({
  year,
  yearsList,
  search,
  sortField,
  sortOrder,
  onChange,
  selectedColumns,
  onColumnsChange,
}: {
  year: number;
  yearsList: number[];
  search: string;
  sortField: SortField;
  sortOrder: SortOrder;
  onChange: (filters: {
    year: number;
    search: string;
    sortField: SortField;
    sortOrder: SortOrder;
  }) => void;
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}) {
  const [localYear, setLocalYear] = useState(year);
  const [localSearch, setLocalSearch] = useState(search);
  const [showModal, setShowModal] = useState(false);

  const handleChange = useCallback(
    (
      newFilters: Partial<{
        year: number;
        search: string;
        sortField: SortField;
        sortOrder: SortOrder;
      }>
    ) => {
      onChange({
        year: localYear,
        search: localSearch,
        sortField,
        sortOrder,
        ...newFilters,
      });
    },
    [localYear, localSearch, sortField, sortOrder, onChange]
  );

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = Number(e.target.value);
      setLocalYear(val);
      handleChange({ year: val });
    },
    [handleChange]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLocalSearch(e.target.value),
    []
  );

  const handleApplySearch = useCallback(
    () => handleChange({ search: localSearch }),
    [handleChange, localSearch]
  );

  const handleSort = useCallback(
    (field: SortField) => {
      handleChange({
        sortField: field,
        sortOrder: sortField === field && sortOrder === 'asc' ? 'desc' : 'asc',
      });
    },
    [handleChange, sortField, sortOrder]
  );

  const handleColumnsChange = useCallback(
    (columns: string[]) => {
      onColumnsChange(columns);
      setShowModal(false);
    },
    [onColumnsChange]
  );

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-50 p-4 rounded shadow-sm">
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Year:</label>
        <select
          value={localYear}
          onChange={handleYearChange}
          className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 h-9"
        >
          {yearsList.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Search:</label>
        <div className="flex gap-0">
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Country name"
            className="border rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 h-9"
          />
          <button
            onClick={handleApplySearch}
            className="border rounded-r px-3 py-1 bg-blue-200 hover:bg-blue-300 transition-colors h-9"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="ml-auto flex flex-col gap-2">
        <span className="font-medium text-gray-700">Sort:</span>
        <div className="flex gap-4">
          <button
            onClick={() => handleSort('name')}
            className="border rounded px-3 bg-gray-200 hover:bg-gray-300 transition-colors h-9"
          >
            Name {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </button>
          <button
            onClick={() => handleSort('population')}
            className="border rounded px-3 bg-gray-200 hover:bg-gray-300 transition-colors h-9"
          >
            Population{' '}
            {sortField === 'population'
              ? sortOrder === 'asc'
                ? '▲'
                : '▼'
              : ''}
          </button>
          <button
            onClick={() => handleSort('co2')}
            className="border rounded px-3 bg-gray-200 hover:bg-gray-300 transition-colors h-9"
          >
            CO₂ {sortField === 'co2' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </button>
          <button
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 h-9"
            onClick={() => setShowModal(true)}
          >
            Select Columns
          </button>
        </div>

        {showModal && (
          <ColumnsModal
            availableColumns={allExtraColumns}
            selectedColumns={selectedColumns}
            onChange={handleColumnsChange}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
});
