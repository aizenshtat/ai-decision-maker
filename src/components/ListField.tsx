// src/components/ListField.tsx

import React from 'react'
import Button from './ui/Button'
import Input from './ui/Input'
import { Label } from './ui/Label'

interface ListFieldProps {
  field: {
    name: string;
    label: string;
  }
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  isEditable?: boolean;
}

const ListField: React.FC<ListFieldProps> = ({ field, value = [], onChange, isEditable = true }) => {
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
    <div className="mb-6">
      <Label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
        {field.label}
      </Label>
      {Array.isArray(value) && value.map((item, index) => (
        <div key={index} className="flex mb-2">
          {isEditable ? (
            <>
              <Input
                id={`${field.name}-${index}`}
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                className="flex-grow"
              />
              <Button
                onClick={() => handleRemove(index)}
                className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600"
              >
                Remove
              </Button>
            </>
          ) : (
            <p className="p-2 bg-gray-100 rounded-lg">{item}</p>
          )}
        </div>
      ))}
      {isEditable && (
        <Button
          onClick={handleAdd}
          className="mt-2 bg-green-500 hover:bg-green-600"
        >
          Add Item
        </Button>
      )}
    </div>
  )
}

export default ListField