// src/components/ListOfObjectsField.tsx

import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Label, ErrorMessage } from './ui'
import SelectField from './SelectField'
import { Field, ObjectStructure } from '@/types/framework'

interface ListOfObjectsFieldProps {
  field: Field;
  value: { [key: string]: string | number }[] | undefined;
  onChange: (value: { [key: string]: string | number }[]) => void;
  isEditable?: boolean;
  getOptionsFromPreviousStep: (dependency: string) => string[];
}

const ListOfObjectsField: React.FC<ListOfObjectsFieldProps> = ({ field, value, onChange, isEditable = true, getOptionsFromPreviousStep }) => {
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
    const newObject = Object.keys(field.object_structure || {}).reduce((acc, key) => {
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

  const renderInputField = (item: { [key: string]: string | number }, index: number, key: string, fieldType: string | ObjectStructure[keyof ObjectStructure]) => {
    const inputProps = {
      id: `${field.name}-${index}-${key}`,
      value: item[key].toString(),
      onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => {
        const newValue = typeof e === 'string' ? e : e.target.value;
        handleItemChange(index, key, newValue);
      }
    };

    if (typeof fieldType === 'object' && fieldType.type === 'select' && fieldType.dependency) {
      const options = getOptionsFromPreviousStep(`${fieldType.dependency.step}.${fieldType.dependency.field}.${fieldType.dependency.use}`);
      return (
        <SelectField
          field={{
            name: `${field.name}-${index}-${key}`,
            label: key,
            options: options
          }}
          value={item[key].toString()}
          onChange={(value) => handleItemChange(index, key, value)}
        />
      );
    } else if (typeof fieldType === 'string') {
      return <Input type={fieldType} {...inputProps} />;
    } else if (typeof fieldType === 'object' && fieldType.type === 'number') {
      return (
        <Input
          type="number"
          min={fieldType.min}
          max={fieldType.max}
          step={fieldType.step}
          {...inputProps}
          onChange={(e) => handleItemChange(index, key, Number(e.target.value))}
        />
      );
    } else {
      return <Input type="text" {...inputProps} />;
    }
  };

  return (
    <div className="space-y-4">
      <Label>{field.label}</Label>
      {internalValue.map((item, index) => (
        <div key={index} className="bg-white shadow-sm rounded-lg p-4">
          {Object.entries(field.object_structure || {}).map(([key, type]) => (
            <div key={key} className="mb-4">
              <Label htmlFor={`${field.name}-${index}-${key}`} className="font-medium text-gray-700">{key}</Label>
              {isEditable ? (
                renderInputField(item, index, key, type)
              ) : (
                <p className="mt-1">{item[key]}</p>
              )}
            </div>
          ))}
          {isEditable && (
            <Button onClick={() => handleRemove(index)} className="bg-red-500 hover:bg-red-600 text-white">
              Remove
            </Button>
          )}
        </div>
      ))}
      {isEditable && (
        <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white">
          Add Item
        </Button>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default ListOfObjectsField;