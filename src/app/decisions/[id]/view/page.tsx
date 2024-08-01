'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MatrixField from '@/components/MatrixField'
import ListOfObjectsField from '@/components/ListOfObjectsField'
import ListField from '@/components/ListField'
import { Framework } from '@/types/framework'
import { Decision } from '@/types/decision'

export default function ViewDecision() {
  const [decision, setDecision] = useState<Decision | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()
  const { id } = params

  const fetchDecisionData = useCallback(async () => {
    try {
      const response = await fetch(`/api/decisions/${id}`)
      if (!response.ok) throw new Error('Failed to fetch decision data')
      const data: Decision = await response.json()
      setDecision(data)
    } catch (error) {
      console.error('Error fetching decision data:', error)
      setError('Failed to load decision data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDecisionData()
  }, [fetchDecisionData])

  if (isLoading) return <div className="text-center mt-10">Loading decision...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>
  if (!decision) return <div className="text-center mt-10">No decision data available.</div>

  const renderStepData = (stepTitle: string, stepData: Record<string, any>) => {
    return Object.entries(stepData).map(([key, value]) => {
      if (key.endsWith('_ai_suggestion')) return null;
      const step = decision.framework.steps.find((s: { title: string }) => s.title === stepTitle);
      const field = step?.fields.find(f => f.name === key);
      const label = field?.label || key;
      return (
        <div key={key} className="mb-4">
          <h3 className="text-xl font-medium mb-2">{label}</h3>
          {(() => {
            switch (field?.type) {
              case 'matrix':
                return (
                  <MatrixField
                    field={{
                      ...field,
                      row_options: Object.keys(value),
                      column_options: Object.keys(Object.values(value)[0] || {})
                    }}
                    value={value}
                    onChange={() => {}}
                    isEditable={false}
                  />
                );
              case 'list_of_objects':
                const getOptionsFromPreviousStep = () => [];
                return (
                  <ListOfObjectsField
                    field={field}
                    value={value}
                    onChange={() => {}}
                    isEditable={false}
                    getOptionsFromPreviousStep={getOptionsFromPreviousStep}
                  />
                );
              case 'list':
                return (
                  <ListField
                    field={field}
                    value={value}
                    onChange={() => {}}
                    isEditable={false}
                  />
                );
              case 'select':
              case 'textarea':
              case 'text':
                return <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>;
              default:
                if (Array.isArray(value)) {
                  return (
                    <ul className="list-disc list-inside">
                      {value.map((item, index) => (
                        <li key={index}>
                          {typeof item === 'object' ? JSON.stringify(item) : item}
                        </li>
                      ))}
                    </ul>
                  );
                } else if (typeof value === 'object') {
                  return (
                    <div>
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey} className="my-2">
                          <strong>{subKey}:</strong> {JSON.stringify(subValue)}
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return <p>{value}</p>;
                }
            }
          })()}
        </div>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 card">
      <h1 className="text-3xl font-bold mb-6">{decision.question}</h1>
      <p className="text-gray-600 mb-4">Framework: {decision.framework.name}</p>
      {decision.framework.steps.map((step: { title: string }, index: number) => {
        const stepData = decision.data[step.title];
        if (!stepData) return null;
        return (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
            {renderStepData(step.title, stepData)}
          </div>
        );
      })}
      <div className="mt-8">
        <Link href={`/decisions/${id}/summary`} className="btn-primary">
          View Summary
        </Link>
      </div>
    </div>
  )
}