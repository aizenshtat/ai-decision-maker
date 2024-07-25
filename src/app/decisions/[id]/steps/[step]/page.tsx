// src/app/decisions/[id]/steps/[step]/page.tsx

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MatrixField from '@/components/MatrixField'
import ListOfObjectsField from '@/components/ListOfObjectsField'
import ListField from '@/components/ListField'
import SelectField from '@/components/SelectField'
import TextField from '@/components/TextField'
import { PERSONAL_DECISION_FRAMEWORK } from '@/lib/decisionFramework'
import { Card, Button, Input, Label, ErrorMessage } from '@/components/ui'

interface StepData {
  title: string;
  description: string;
  fields: any[];
}

export default function DecisionStep() {
  const [stepData, setStepData] = useState<StepData | null>(null)
  const [inputs, setInputs] = useState<Record<string, any>>({})
  const [allStepData, setAllStepData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const step = params.step as string
  const [aiSuggestion, setAiSuggestion] = useState('')
  const dataFetchedRef = useRef(false)
  const [summary, setSummary] = useState('')

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fetchData = async () => {
      setIsLoading(true)
      setError('')
      try {
        const decisionData = await fetchStepData()
        if (decisionData.status === 'completed') {
          const summaryResponse = await fetch(`/api/decisions/${id}/summary`)
          const summaryData = await summaryResponse.json()
          setSummary(summaryData.summary)
        } else {
          await loadOrFetchAiSuggestion()
        }
      } catch (err) {
        setError('Failed to load decision data. Please try again.')
        console.error('Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, step])

  const loadOrFetchAiSuggestion = async () => {
    const cachedData = localStorage.getItem(`aiData_${id}_${step}`)
    if (cachedData) {
      const parsedData = JSON.parse(cachedData)
      setAiSuggestion(parsedData.suggestion)
      setInputs(prevInputs => ({
        ...prevInputs,
        ...parsedData.pre_filled_data
      }))
    } else {
      await fetchAiSuggestion()
    }
  }

  const fetchAiSuggestion = async () => {
    try {
      const response = await fetch(`/api/decisions/${id}/suggestions?step=${step}`)
      if (!response.ok) throw new Error('Failed to fetch AI suggestion')
      const data = await response.json()
      
      if (data.suggestion && data.pre_filled_data) {
        setAiSuggestion(data.suggestion)
        setInputs(prevInputs => ({
          ...prevInputs,
          ...data.pre_filled_data
        }))
        localStorage.setItem(`aiData_${id}_${step}`, JSON.stringify(data))
      } else {
        console.error('Invalid AI suggestion format:', data)
        setError('Failed to parse AI suggestion. Please try again.')
      }
    } catch (error) {
      console.error('Error fetching AI suggestion:', error)
      setError('Failed to load AI suggestion. Please try again.')
    }
  }

  const fetchStepData = async () => {
    try {
      const response = await fetch(`/api/decisions/${id}/steps/${step}`)
      if (!response.ok) throw new Error('Failed to fetch step data')
      const data = await response.json()
      console.log('Fetched step data:', data);
      
      if (data.status === 'completed') {
        setStepData({ status: 'completed', question: data.question })
        return data
      }
      
      setStepData(data)
      setAllStepData(data.all_step_data || {})
      
      if (data.saved_data && Object.keys(data.saved_data).length > 0) {
        setInputs(data.saved_data)
      }
      return data
    } catch (error) {
      console.error('Error fetching step data:', error)
      setError('Failed to load step data. Please try again.')
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix the validation errors before proceeding.');
      return;
    }
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/decisions/${id}/steps/${step}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepData: inputs, aiSuggestion }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit step')
      }
      
      const data = await response.json()
      if (data.completed) {
        router.push(`/decisions/${id}/summary`)
      } else {
        router.push(`/decisions/${id}/steps/${parseInt(step) + 1}`)
      }
    } catch (error) {
      console.error('Error submitting step:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit step. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (name: string, value: any) => {
    setInputs(prev => {
      const newInputs = { ...prev, [name]: value };
      validateInputs(newInputs);
      return newInputs;
    });
  };

  const validateInputs = (inputs: any) => {
    const errors: { [key: string]: string } = {};

    if (stepData?.fields) {
      stepData.fields.forEach(field => {
        if (field.type === 'list_of_objects' && field.validation?.total_weight) {
          const items = inputs[field.name] || [];
          const totalWeight = items.reduce((sum: number, item: any) => sum + (Number(item.weight) || 0), 0);
          if (totalWeight > field.validation.total_weight.max) {
            errors[field.name] = field.validation.total_weight.message;
          }
        }
      });
    }

    setValidationErrors(errors);
  };

  const getOptionsFromPreviousStep = (dependency: string) => {
    const [stepTitle, fieldName, use] = dependency.split('.')
    console.log(`Getting options for ${stepTitle}.${fieldName}.${use}`, allStepData);
    
    const stepData = allStepData[stepTitle]
    if (!stepData) {
      console.error(`Step data not found for ${stepTitle}`);
      return [];
    }

    const fieldData = stepData[fieldName]
    if (!fieldData) {
      console.error(`Field data not found for ${fieldName} in ${stepTitle}`);
      return [];
    }

    console.log('Field data:', fieldData);

    if (Array.isArray(fieldData)) {
      const options = fieldData.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item[use] || JSON.stringify(item);
        }
        return String(item);
      });
      console.log('Extracted options:', options);
      return options;
    } else {
      console.error(`Field data is not an array for ${fieldName} in ${stepTitle}`);
      return [];
    }
  }

  const renderField = (field: any) => {
    console.log('Rendering field:', field);
    switch (field.type) {
      case 'matrix':
        const rowOptions = field.dependencies.rows ? getOptionsFromPreviousStep(`${field.dependencies.rows.step}.${field.dependencies.rows.field}.${field.dependencies.rows.use}`) : []
        const columnOptions = field.dependencies.columns ? getOptionsFromPreviousStep(`${field.dependencies.columns.step}.${field.dependencies.columns.field}.${field.dependencies.columns.use}`) : []
        console.log('Matrix field options:', { rowOptions, columnOptions });
        return (
          <MatrixField
            key={field.name}
            field={{
              ...field,
              row_options: rowOptions,
              column_options: columnOptions
            }}
            value={inputs[field.name] as { [row: string]: { [column: string]: number } } | undefined}
            onChange={(value) => handleInputChange(field.name, value)}
          />
        );
      case 'list_of_objects':
        return (
          <ListOfObjectsField
            key={field.name}
            field={field}
            value={inputs[field.name] || []}
            onChange={(value) => handleInputChange(field.name, value)}
          />
        );
      case 'list':
        return (
          <ListField
            key={field.name}
            field={field}
            value={inputs[field.name]}
            onChange={(value) => handleInputChange(field.name, value)}
          />
        );
      case 'select':
        const options = field.dependencies ? getOptionsFromPreviousStep(`${field.dependencies.step}.${field.dependencies.field}.${field.dependencies.use}`) : []
        console.log('Select field options:', options);
        return (
          <SelectField
            key={field.name}
            field={{...field, options}}
            value={inputs[field.name] || ''}
            onChange={(value) => handleInputChange(field.name, value)}
          />
        );
      default:
        return (
          <TextField
            key={field.name}
            field={field}
            value={inputs[field.name]}
            onChange={(value) => handleInputChange(field.name, value)}
          />
        );
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading decision data...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>

  if (stepData?.status === 'completed') {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-5">{stepData.question}</h1>
        <h2 className="text-xl font-semibold mb-4">Decision Summary</h2>
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
        <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (!stepData) return <div className="text-center mt-10">Loading decision data...</div>
  if (!stepData.fields) return <div className="text-center mt-10">No steps available for this decision.</div>

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-5">{stepData.title}</h1>
      <p className="mb-5">{stepData.description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {stepData.fields.map((field) => (
          <div key={field.name} className="bg-gray-50 p-6 rounded-lg">
            {renderField(field)}
            {validationErrors[field.name] && (
              <p className="text-red-500 mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        ))}
        
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="font-bold mb-2">AI Suggestion:</h3>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            components={{
              ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
            }}
            className="prose max-w-none"
          >
            {aiSuggestion}
          </ReactMarkdown>
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => router.push(`/decisions/${id}/steps/${parseInt(step) - 1}`)}
            disabled={parseInt(step) === 0 || isLoading}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:bg-gray-200 transition duration-150 ease-in-out"
          >
            Previous Step
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition duration-150 ease-in-out"
          >
            {isLoading ? 'Processing...' : 'Next Step'}
          </button>
        </div>
      </form>
    </div>
  );
}