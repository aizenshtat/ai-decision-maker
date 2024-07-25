// src/components/TextField.tsx

import React from 'react'

interface TextFieldProps {
  field: {
    name: string
    label: string
    type: string
    placeholder?: string
  }
  value: string | undefined
  onChange: (value: string) => void
}

const TextField: React.FC<TextFieldProps> = ({ field, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          id={field.name}
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={4}
        />
      ) : (
        <input
          type={field.type}
          id={field.name}
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      )}
    </div>
  )
}

export default TextField