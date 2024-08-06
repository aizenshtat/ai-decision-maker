// src/components/SelectField.tsx

import React from 'react'
import Select from './ui/Select'

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
  if (!field.options || field.options.length === 0) {
    return <p className="text-red-500 italic">No options available. Please complete previous steps.</p>;
  }

  const optionsForSelect = field.options.map(option => ({
    value: option,
    label: option
  }));

  return (
    <Select
      id={field.name}
      label={field.label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={optionsForSelect}
    />
  )
}

export default SelectField