// src/components/MatrixField.tsx

import React from 'react'

interface MatrixFieldProps {
  field: {
    name: string;
    label: string;
    row_options?: string[];
    column_options?: string[];
  };
  value: { [row: string]: { [column: string]: number } } | undefined;
  onChange: (value: { [row: string]: { [column: string]: number } }) => void;
  isEditable?: boolean;
}

const MatrixField: React.FC<MatrixFieldProps> = ({ field, value, onChange, isEditable = true }) => {
  console.log('MatrixField props:', { field, value });

  const rowOptions = field.row_options || [];
  const columnOptions = field.column_options || [];

  console.log('Processed options:', { rowOptions, columnOptions });

  const handleCellChange = (row: string, column: string, newValue: string) => {
    const numValue = parseInt(newValue, 10);
    if (isNaN(numValue)) return;

    const updatedValue = {
      ...value,
      [row]: {
        ...(value && value[row]),
        [column]: numValue
      }
    };
    onChange(updatedValue);
  };

  if (rowOptions.length === 0 || columnOptions.length === 0) {
    console.error('Missing options:', { rowOptions, columnOptions });
    return (
      <div className="text-red-500 italic">
        Error: Missing {rowOptions.length === 0 ? 'row' : 'column'} options for matrix field. 
        Field name: {field.name}. 
        Please ensure you have defined {rowOptions.length === 0 ? 'options' : 'criteria'} in the previous steps.
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              {columnOptions.map((column) => (
                <th key={column} className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rowOptions.map((row) => (
              <tr key={row}>
                <td className="p-3 text-sm font-medium text-gray-900">{row}</td>
                {columnOptions.map((column) => (
                  <td key={`${row}-${column}`} className="p-3">
                    {isEditable ? (
                      <input
                        type="number"
                        value={value && value[row] && value[row][column] || ''}
                        onChange={(e) => handleCellChange(row, column, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min={1}
                        max={5}
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{value && value[row] && value[row][column] || ''}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatrixField;