// src/components/ListOfObjectsField.tsx

import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Label, ErrorMessage } from './ui'

interface ListOfObjectsFieldProps {
  field: {
    name: string;
    label: string;
    object_structure: { [key: string]: string | { type: string; min?: number; max?: number; step?: number } };
    validation?: {
      total_weight?: {
        max: number;
        message: string;
      }
    };
  };
  value: { [key: string]: string | number }[] | undefined;
  onChange: (value: { [key: string]: string | number }[]) => void;
}

const ListOfObjectsField: React.FC<ListOfObjectsFieldProps> = ({ field, value, onChange }) => {
  const [error, setError] = useState<string | null>(null);
  const [internalValue, setInternalValue] = useState<{ [key: string]: string | number }[]>([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setInternalValue(value);
    } else {
      setInternalValue([]);
    }
  }, [value]);

  const handleAdd = () => {
    const newObject = Object.keys(field.object_structure).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as { [key: string]: string | number });
    const newValue = [...internalValue, newObject];
    setInternalValue(newValue);
    onChange(newValue);
  };

  const handleRemove = (index: number) => {
    const newValue = internalValue.filter((_, i) => i !== index);
    setInternalValue(newValue);
    onChange(newValue);
    validateTotalWeight(newValue);
  };

  const handleItemChange = (index: number, key: string, newValue: string | number) => {
    const updatedValue = internalValue.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: newValue };
      }
      return item;
    });

    // Check for unique names
    if (key === 'name') {
      const names = updatedValue.map(item => item.name);
      const isUnique = new Set(names).size === names.length;
      if (!isUnique) {
        setError('Names must be unique');
        return;
      }
    }

    setError(null);
    setInternalValue(updatedValue);
    onChange(updatedValue);
    validateTotalWeight(updatedValue);
  };

  const validateTotalWeight = (items: { [key: string]: string | number }[]) => {
    if (field.validation?.total_weight) {
      const totalWeight = items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
      if (totalWeight > field.validation.total_weight.max) {
        setError(field.validation.total_weight.message);
      } else {
        setError(null);
      }
    }
  };

  const renderInputField = (item: { [key: string]: string | number }, index: number, key: string, type: string | { type: string; min?: number; max?: number; step?: number }) => {
    const inputProps = {
      id: `${field.name}-${index}-${key}`,
      value: item[key].toString(),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(index, key, e.target.value)
    };

    if (typeof type === 'string') {
      return <Input type={type} {...inputProps} />;
    } else {
      return (
        <Input
          type="number"
          min={type.min}
          max={type.max}
          step={type.step}
          {...inputProps}
          onChange={(e) => handleItemChange(index, key, Number(e.target.value))}
        />
      );
    }
  };

  return (
    <div className="space-y-4">
      <Label>{field.label}</Label>
      {internalValue.map((item, index) => (
        <Card key={index}>
          {Object.entries(field.object_structure).map(([key, type]) => (
            <div key={key} className="mb-4">
              <Label htmlFor={`${field.name}-${index}-${key}`}>{key}</Label>
              {renderInputField(item, index, key, type)}
            </div>
          ))}
          <Button onClick={() => handleRemove(index)} className="bg-red-500 hover:bg-red-600">
            Remove
          </Button>
        </Card>
      ))}
      <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-600">
        Add Item
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default ListOfObjectsField;