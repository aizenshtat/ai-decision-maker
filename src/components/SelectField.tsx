// src/components/SelectField.tsx

import React from 'react'

interface SelectFieldProps {
  field: {
    name: string
    label: string
    options: string[]
  }
  value: string
  onChange: (value: string) => void
}

const SelectField: React.FC<SelectFieldProps> = ({ field, value, onChange }) => {
  console.log('SelectField props:', field);

  if (!field.options || field.options.length === 0) {
    console.error('No options available for SelectField:', field.name);
    return <p>No options available. Please complete previous steps.</p>;
  }

  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      <select
        id={field.name}
        name={field.name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">Select an option</option>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectField