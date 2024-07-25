// src/components/ListField.tsx

import React from 'react'

interface ListFieldProps {
  field: {
    name: string;
    label: string;
  }
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

const ListField: React.FC<ListFieldProps> = ({ field, value = [], onChange }) => {
  const handleAdd = () => {
    onChange([...value, ''])
  }

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const handleItemChange = (index: number, newValue: string) => {
    const updatedValue = value.map((item, i) => (i === index ? newValue : item))
    onChange(updatedValue)
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
      {Array.isArray(value) && value.map((item, index) => (
        <div key={index} className="flex mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Add Item
      </button>
    </div>
  )
}

export default ListField