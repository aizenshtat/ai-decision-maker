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
    <div className="mb-6">
      <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          id={field.name}
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}
    </div>
  )
}

export default TextField