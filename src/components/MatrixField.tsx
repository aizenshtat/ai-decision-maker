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
}

const MatrixField: React.FC<MatrixFieldProps> = ({ field, value, onChange }) => {
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
      <div className="text-red-500">
        Error: Missing {rowOptions.length === 0 ? 'row' : 'column'} options for matrix field. 
        Field name: {field.name}. 
        Please ensure you have defined {rowOptions.length === 0 ? 'options' : 'criteria'} in the previous steps.
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2"></th>
            {columnOptions.map((column) => (
              <th key={column} className="border border-gray-300 p-2">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowOptions.map((row) => (
            <tr key={row}>
              <td className="border border-gray-300 p-2 font-medium">{row}</td>
              {columnOptions.map((column) => (
                <td key={`${row}-${column}`} className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={value && value[row] && value[row][column] || ''}
                    onChange={(e) => handleCellChange(row, column, e.target.value)}
                    className="w-full p-1 border-gray-300 rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    min={1}
                    max={5}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatrixField;