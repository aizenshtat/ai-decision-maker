// src/components/ListOfObjectsField.tsx

import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Select, ErrorMessage } from './ui'
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

    if (typeof fieldType === 'object' && 'dependency' in fieldType && fieldType.dependency) {
      const { step, field, use } = fieldType.dependency;
      if (step && field && use) {
        const options = getOptionsFromPreviousStep(`${step}.${field}.${use}`);
        return (
          <Select
            label={key}
            value={item[key].toString()}
            onChange={(e) => handleItemChange(index, key, e.target.value)}
            options={options}
          />
        );
      }
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
      <label className="form-label">{field.label}</label>
      {internalValue.map((item, index) => (
        <Card key={index} className="space-y-4">
          {Object.entries(field.object_structure || {}).map(([key, type]) => (
            <div key={key}>
              <label htmlFor={`${field.name}-${index}-${key}`} className="form-label">{key}</label>
              {isEditable ? (
                renderInputField(item, index, key, type)
              ) : (
                <p className="mt-1">{item[key]}</p>
              )}
            </div>
          ))}
          {isEditable && (
            <Button onClick={() => handleRemove(index)} className="btn-danger">
              Remove
            </Button>
          )}
        </Card>
      ))}
      {isEditable && (
        <Button onClick={handleAdd} className="btn-secondary">
          Add Item
        </Button>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default ListOfObjectsField;