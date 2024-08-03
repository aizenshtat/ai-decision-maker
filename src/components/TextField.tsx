// src/components/TextField.tsx

import React from 'react'
import Input from './ui/Input'
import Textarea from './ui/Textarea'

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
      {field.type === 'textarea' ? (
        <Textarea
          id={field.name}
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
        />
      ) : (
        <Input
          type={field.type}
          id={field.name}
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      )}
    </div>
  )
}

export default TextField