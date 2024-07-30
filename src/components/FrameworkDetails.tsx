// src/components/FrameworkDetails.tsx

'use client'

import { useState, useEffect } from 'react'
import { Framework, Step, Field, ObjectStructure, MatrixStructure, CellFormat, Validation, Dependency } from '@/types/framework'
import { Card, Button, Input, Label, Textarea, IconButton, Select } from './ui'
import { ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react'

interface FrameworkDetailsProps {
  id: string
}

export default function FrameworkDetails({ id }: FrameworkDetailsProps) {
  const [framework, setFramework] = useState<Framework | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])

  useEffect(() => {
    fetchFramework()
  }, [id])

  const fetchFramework = async () => {
    try {
      const response = await fetch(`/api/frameworks/${id}`)
      if (!response.ok) throw new Error('Failed to fetch framework')
      const data = await response.json()
      setFramework(data)
    } catch (error) {
      console.error('Error fetching framework:', error)
      setError('Failed to load framework. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/frameworks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(framework),
      })
      if (!response.ok) throw new Error('Failed to update framework')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating framework:', error)
      setError('Failed to update framework. Please try again.')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    fetchFramework() // Reload the original data
  }

  const handleStepChange = (index: number, field: keyof Step, value: string) => {
    if (framework) {
      const newSteps = [...framework.steps]
      newSteps[index] = { ...newSteps[index], [field]: value }
      setFramework({ ...framework, steps: newSteps })
    }
  }

  const handleFieldChange = (stepIndex: number, fieldIndex: number, field: keyof Field, value: any) => {
    if (framework) {
      const newSteps = [...framework.steps];
      const newFields = [...newSteps[stepIndex].fields];
      if (field === 'dependencies') {
        newFields[fieldIndex] = {
          ...newFields[fieldIndex],
          dependencies: value as Field['dependencies']
        };
      } else {
        newFields[fieldIndex] = { ...newFields[fieldIndex], [field]: value };
      }
      newSteps[stepIndex] = { ...newSteps[stepIndex], fields: newFields };
      setFramework({ ...framework, steps: newSteps });
    }
  }

  const toggleStepExpansion = (index: number) => {
    setExpandedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const addStep = () => {
    if (framework) {
      setFramework({
        ...framework,
        steps: [...framework.steps, { title: '', description: '', fields: [] }]
      })
    }
  }

  const removeStep = (index: number) => {
    if (framework) {
      const newSteps = framework.steps.filter((_, i) => i !== index)
      setFramework({ ...framework, steps: newSteps })
    }
  }

  const addField = (stepIndex: number) => {
    if (framework) {
      const newSteps = [...framework.steps]
      newSteps[stepIndex].fields.push({ name: '', label: '', type: 'text' })
      setFramework({ ...framework, steps: newSteps })
    }
  }

  const removeField = (stepIndex: number, fieldIndex: number) => {
    if (framework) {
      const newSteps = [...framework.steps]
      newSteps[stepIndex].fields = newSteps[stepIndex].fields.filter((_, i) => i !== fieldIndex)
      setFramework({ ...framework, steps: newSteps })
    }
  }

  if (isLoading) return <div className="text-center mt-10">Loading framework...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>
  if (!framework) return <div className="text-center mt-10">Framework not found.</div>

  return (
    <Card className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? 'Edit Framework' : 'Framework Details'}
      </h1>
      <div className="space-y-6">
        <Input
          id="framework-name"
          label="Name"
          value={framework.name}
          onChange={(e) => setFramework({ ...framework, name: e.target.value })}
          disabled={!isEditing}
        />
        <Textarea
          id="framework-description"
          label="Description"
          value={framework.description || ''}
          onChange={(e) => setFramework({ ...framework, description: e.target.value })}
          disabled={!isEditing}
        />
        <div>
          <h2 className="text-xl font-semibold mb-2">Steps</h2>
          {framework.steps.map((step, stepIndex) => (
            <Card key={stepIndex} className="mb-4 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Step {stepIndex + 1}: {step.title}</h3>
                <div>
                  <IconButton
                    onClick={() => toggleStepExpansion(stepIndex)}
                    icon={expandedSteps.includes(stepIndex) ? ChevronUp : ChevronDown}
                  />
                  {isEditing && (
                    <IconButton
                      onClick={() => removeStep(stepIndex)}
                      icon={Trash}
                      className="ml-2 text-red-500"
                    />
                  )}
                </div>
              </div>
              {expandedSteps.includes(stepIndex) && (
                <div className="mt-4 space-y-4">
                  <Input
                    id={`step-${stepIndex}-title`}
                    label="Title"
                    value={step.title}
                    onChange={(e) => handleStepChange(stepIndex, 'title', e.target.value)}
                    disabled={!isEditing}
                  />
                  <Textarea
                    id={`step-${stepIndex}-description`}
                    label="Description"
                    value={step.description || ''}
                    onChange={(e) => handleStepChange(stepIndex, 'description', e.target.value)}
                    disabled={!isEditing}
                  />
                  <Textarea
                    id={`step-${stepIndex}-ai-instructions`}
                    label="AI Instructions"
                    value={step.ai_instructions || ''}
                    onChange={(e) => handleStepChange(stepIndex, 'ai_instructions', e.target.value)}
                    disabled={!isEditing}
                  />
                  <div>
                    <h4 className="font-semibold mt-2 mb-2">Fields</h4>
                    {step.fields.map((field, fieldIndex) => (
                      <FieldDetails
                        key={fieldIndex}
                        field={field}
                        isEditing={isEditing}
                        onChange={(updatedField) => {
                          const newSteps = [...framework.steps];
                          newSteps[stepIndex].fields[fieldIndex] = updatedField;
                          setFramework({ ...framework, steps: newSteps });
                        }}
                      />
                    ))}
                    {isEditing && (
                      <Button onClick={() => addField(stepIndex)} className="mt-2">
                        Add Field
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
          {isEditing && (
            <Button onClick={addStep} className="mt-2">
              Add Step
            </Button>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleCancel} className="bg-white text-black border border-gray-300 hover:bg-gray-100">Cancel</Button>
          </>
        ) : (
          framework.id !== 'default' && <Button onClick={handleEdit}>Edit</Button>
        )}
      </div>
    </Card>
  )
}

const FieldDetails: React.FC<{ field: Field; isEditing: boolean; onChange: (updatedField: Field) => void }> = ({ field, isEditing, onChange }) => {
  const updateField = (key: string, value: any) => {
    onChange({ ...field, [key]: value });
  };

  const RemoveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="text-red-500 hover:text-red-700 font-medium text-sm"
      type="button"
    >
      Remove
    </button>
  );

  const renderObjectStructure = (structure: ObjectStructure) => (
    <div className="ml-4 space-y-4">
      {Object.entries(structure).map(([key, value]) => (
        <div key={key} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold text-lg">Field: {key}</h5>
            {isEditing && (
              <RemoveButton onClick={() => {
                const newStructure = { ...structure };
                delete newStructure[key];
                updateField('object_structure', newStructure);
              }} />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id={`field-${field.name}-object-structure-${key}-name`}
              label="Field Name"
              value={key}
              onChange={(e) => {
                const newStructure = { ...structure };
                delete newStructure[key];
                newStructure[e.target.value] = value;
                updateField('object_structure', newStructure);
              }}
              disabled={!isEditing}
            />
            {typeof value === 'string' ? (
              <Select
                id={`field-${field.name}-object-structure-${key}-type`}
                label="Field Type"
                value={value}
                onChange={(e) => updateField('object_structure', { ...structure, [key]: e.target.value })}
                disabled={!isEditing}
                options={['text', 'textarea', 'number']}
              />
            ) : (
              <div className="space-y-2">
                <Input
                  id={`field-${field.name}-object-structure-${key}-min`}
                  label="Min"
                  type="number"
                  value={value.min?.toString() || ''}
                  onChange={(e) => updateField('object_structure', { 
                    ...structure, 
                    [key]: { ...value, min: Number(e.target.value) } 
                  })}
                  disabled={!isEditing}
                />
                <Input
                  id={`field-${field.name}-object-structure-${key}-max`}
                  label="Max"
                  type="number"
                  value={value.max?.toString() || ''}
                  onChange={(e) => updateField('object_structure', { 
                    ...structure, 
                    [key]: { ...value, max: Number(e.target.value) } 
                  })}
                  disabled={!isEditing}
                />
                <Input
                  id={`field-${field.name}-object-structure-${key}-step`}
                  label="Step"
                  type="number"
                  value={value.step?.toString() || ''}
                  onChange={(e) => updateField('object_structure', { 
                    ...structure, 
                    [key]: { ...value, step: Number(e.target.value) } 
                  })}
                  disabled={!isEditing}
                />
              </div>
            )}
          </div>
        </div>
      ))}
      {isEditing && (
        <Button
          onClick={() => {
            const newKey = `newField${Object.keys(structure).length + 1}`;
            updateField('object_structure', { ...structure, [newKey]: 'text' });
          }}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Add Field
        </Button>
      )}
    </div>
  );

  const renderValidation = (validation: Validation) => (
    <div className="ml-4 space-y-4">
      {Object.entries(validation).map(([key, value]) => (
        <div key={key} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold text-lg">Validation: {key}</h5>
            {isEditing && (
              <RemoveButton onClick={() => {
                const newValidation = { ...validation };
                delete newValidation[key];
                updateField('validation', newValidation);
              }} />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id={`field-${field.name}-validation-${key}-max`}
              label="Max"
              value={value.max.toString()}
              onChange={(e) => updateField('validation', { 
                ...validation, 
                [key]: { ...value, max: parseInt(e.target.value) } 
              })}
              disabled={!isEditing}
              type="number"
            />
            <Input
              id={`field-${field.name}-validation-${key}-message`}
              label="Message"
              value={value.message}
              onChange={(e) => updateField('validation', { 
                ...validation, 
                [key]: { ...value, message: e.target.value } 
              })}
              disabled={!isEditing}
            />
          </div>
        </div>
      ))}
      {isEditing && (
        <Button
          onClick={() => {
            const newKey = `newValidation${Object.keys(validation).length + 1}`;
            updateField('validation', { ...validation, [newKey]: { max: 100, message: '' } });
          }}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Add Validation
        </Button>
      )}
    </div>
  );

  const renderDependencies = (dependencies: Dependency | { [key: string]: Dependency }) => {
    const isMultipleDependencies = typeof dependencies === 'object' && !('step' in dependencies);

    return (
      <div className="space-y-4">
        {isMultipleDependencies ? (
          Object.entries(dependencies).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-semibold text-lg">Dependency: {key}</h5>
                {isEditing && (
                  <RemoveButton onClick={() => {
                    const newDependencies = { ...dependencies };
                    delete newDependencies[key];
                    updateField('dependencies', newDependencies);
                  }} />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <Input
                  id={`field-${field.name}-dependencies-${key}-name`}
                  label="Dependency Name"
                  value={key}
                  onChange={(e) => {
                    const newDependencies = { ...dependencies };
                    const dependencyValue = newDependencies[key];
                    delete newDependencies[key];
                    newDependencies[e.target.value] = dependencyValue;
                    updateField('dependencies', newDependencies);
                  }}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  id={`field-${field.name}-dependencies-${key}-step`}
                  label="Step"
                  value={value.step}
                  onChange={(e) => updateField('dependencies', { 
                    ...dependencies, 
                    [key]: { ...value, step: e.target.value } 
                  })}
                  disabled={!isEditing}
                />
                <Input
                  id={`field-${field.name}-dependencies-${key}-field`}
                  label="Field"
                  value={value.field}
                  onChange={(e) => updateField('dependencies', { 
                    ...dependencies, 
                    [key]: { ...value, field: e.target.value } 
                  })}
                  disabled={!isEditing}
                />
                <Input
                  id={`field-${field.name}-dependencies-${key}-use`}
                  label="Use"
                  value={value.use}
                  onChange={(e) => updateField('dependencies', { 
                    ...dependencies, 
                    [key]: { ...value, use: e.target.value } 
                  })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-lg mb-2">Dependency</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                id={`field-${field.name}-dependencies-step`}
                label="Step"
                value={(dependencies as Dependency).step}
                onChange={(e) => updateField('dependencies', { ...(dependencies as Dependency), step: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                id={`field-${field.name}-dependencies-field`}
                label="Field"
                value={(dependencies as Dependency).field}
                onChange={(e) => updateField('dependencies', { ...(dependencies as Dependency), field: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                id={`field-${field.name}-dependencies-use`}
                label="Use"
                value={(dependencies as Dependency).use}
                onChange={(e) => updateField('dependencies', { ...(dependencies as Dependency), use: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        )}
        {isEditing && isMultipleDependencies && (
          <Button 
            onClick={() => {
              const newKey = `newDependency${Object.keys(dependencies).length + 1}`;
              updateField('dependencies', { ...dependencies, [newKey]: { step: '', field: '', use: '' } });
            }} 
            className="bg-green-500 hover:bg-green-600 text-white mt-4"
          >
            Add Dependency
          </Button>
        )}
      </div>
    );
  };

  const renderMatrixStructure = (structure: MatrixStructure) => (
    <div className="ml-4 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id={`field-${field.name}-matrix-rows`}
          label="Rows"
          value={structure.rows}
          onChange={(e) => updateField('matrix_structure', { ...structure, rows: e.target.value })}
          disabled={!isEditing}
        />
        <Input
          id={`field-${field.name}-matrix-columns`}
          label="Columns"
          value={structure.columns}
          onChange={(e) => updateField('matrix_structure', { ...structure, columns: e.target.value })}
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderCellFormat = (format: CellFormat) => (
    <div className="ml-4 space-y-2">
      <Select
        id={`field-${field.name}-cell-format-type`}
        label="Cell Type"
        value={format.type}
        onChange={(e) => updateField('cell_format', { ...format, type: e.target.value })}
        disabled={!isEditing}
        options={['number', 'text', 'select']}
      />
      {format.type === 'number' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id={`field-${field.name}-cell-format-min`}
            label="Min"
            type="number"
            value={format.min?.toString() || ''}
            onChange={(e) => updateField('cell_format', { ...format, min: Number(e.target.value) })}
            disabled={!isEditing}
          />
          <Input
            id={`field-${field.name}-cell-format-max`}
            label="Max"
            type="number"
            value={format.max?.toString() || ''}
            onChange={(e) => updateField('cell_format', { ...format, max: Number(e.target.value) })}
            disabled={!isEditing}
          />
          <Input
            id={`field-${field.name}-cell-format-step`}
            label="Step"
            type="number"
            value={format.step?.toString() || ''}
            onChange={(e) => updateField('cell_format', { ...format, step: Number(e.target.value) })}
            disabled={!isEditing}
          />
        </div>
      )}
    </div>
  );

  return (
    <Card className="mb-6 p-6 bg-white shadow-md rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          id={`field-${field.name}-name`}
          label="Name"
          value={field.name}
          onChange={(e) => updateField('name', e.target.value)}
          disabled={!isEditing}
        />
        <Input
          id={`field-${field.name}-label`}
          label="Label"
          value={field.label}
          onChange={(e) => updateField('label', e.target.value)}
          disabled={!isEditing}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select
          id={`field-${field.name}-type`}
          label="Type"
          value={field.type}
          onChange={(e) => updateField('type', e.target.value)}
          disabled={!isEditing}
          options={['text', 'textarea', 'number', 'select', 'list_of_objects', 'matrix']}
        />
        <Input
          id={`field-${field.name}-placeholder`}
          label="Placeholder"
          value={field.placeholder || ''}
          onChange={(e) => updateField('placeholder', e.target.value)}
          disabled={!isEditing}
        />
      </div>
      <Textarea
        id={`field-${field.name}-description`}
        label="Description"
        value={field.description || ''}
        onChange={(e) => updateField('description', e.target.value)}
        disabled={!isEditing}
        className="mb-4"
      />
      {(field.type === 'list_of_objects' || field.type === 'select') && field.object_structure && (
        <div>
          <h4 className="font-semibold mt-2">Object Structure</h4>
          {renderObjectStructure(field.object_structure)}
        </div>
      )}
      {field.type === 'matrix' && field.matrix_structure && (
        <div>
          <h4 className="font-semibold mt-2">Matrix Structure</h4>
          {renderMatrixStructure(field.matrix_structure)}
        </div>
      )}
      {field.type === 'matrix' && field.cell_format && (
        <div>
          <h4 className="font-semibold mt-2">Cell Format</h4>
          {renderCellFormat(field.cell_format)}
        </div>
      )}
      {field.validation && (
        <div>
          <h4 className="font-semibold mt-2">Validation</h4>
          {renderValidation(field.validation)}
        </div>
      )}
      {field.dependencies && (
        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-2">Dependencies</h4>
          {renderDependencies(field.dependencies)}
        </div>
      )}
      {isEditing && !field.dependencies && (
        <Button 
          onClick={() => {
            if (field.type === 'select') {
              updateField('dependencies', { step: '', field: '', use: '' });
            } else {
              updateField('dependencies', { newDependency: { step: '', field: '', use: '' } });
            }
          }} 
          className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
        >
          Add Dependencies
        </Button>
      )}
    </Card>
  );
};