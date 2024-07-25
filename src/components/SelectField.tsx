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
    return <p className="text-red-500 italic">No options available. Please complete previous steps.</p>;
  }

  return (
    <div className="mb-6">
      <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
        {field.label}
      </label>
      <div className="relative">
        <select
          id={field.name}
          name={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
        >
          <option value="">Select an option</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SelectField