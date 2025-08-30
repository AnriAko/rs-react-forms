import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ColumnsModalProps = {
  availableColumns: string[];
  selectedColumns: string[];
  onClose: () => void;
  onChange: (columns: string[]) => void;
};

export const ColumnsModal = ({
  availableColumns,
  selectedColumns,
  onClose,
  onChange,
}: ColumnsModalProps) => {
  const [localSelection, setLocalSelection] =
    useState<string[]>(selectedColumns);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const toggleColumn = (col: string) => {
    setLocalSelection((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleApply = () => {
    onChange(localSelection);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4">Select Columns</h2>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mb-4">
          {availableColumns.map((col) => (
            <label key={col} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localSelection.includes(col)}
                onChange={() => toggleColumn(col)}
              />
              <span>{col}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(modalContent, modalRoot);
};
