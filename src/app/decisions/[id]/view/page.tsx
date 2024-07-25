'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ViewDecision() {
  const [decision, setDecision] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()
  const { id } = params

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const response = await fetch(`/api/decisions/${id}`)
        if (!response.ok) throw new Error('Failed to fetch decision')
        const data = await response.json()
        console.log('Fetched decision data:', data)
        setDecision(data)
      } catch (error) {
        console.error('Error fetching decision:', error)
        setError('Failed to load decision. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDecision()
  }, [id])

  if (isLoading) return <div className="text-center mt-10">Loading decision...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>
  if (!decision) return <div className="text-center mt-10">No decision data available.</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">{decision.question}</h1>
      {decision.steps && decision.steps.length > 0 ? (
        decision.steps.map((step, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
            <p className="mb-4">{step.description}</p>
            {step.data && Object.entries(step.data).map(([key, value]) => (
              <div key={key} className="mb-4">
                <h3 className="text-xl font-medium mb-2">{key}</h3>
                {typeof value === 'string' ? (
                  <ReactMarkdown>{value}</ReactMarkdown>
                ) : (
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No steps available for this decision.</p>
      )}
      <div className="mt-8">
        <Link href={`/decisions/${id}/summary`} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          View Summary
        </Link>
      </div>
    </div>
  )
}