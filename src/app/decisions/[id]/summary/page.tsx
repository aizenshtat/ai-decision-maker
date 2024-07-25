// src/app/decisions/[id]/summary/page.tsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function DecisionSummary() {
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [frameworkName, setFrameworkName] = useState('')
  const params = useParams()
  const { id } = params

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`/api/decisions/${id}/summary`)
      if (!response.ok) throw new Error('Failed to fetch summary')
      const data = await response.json()
      setSummary(data.summary)
      setFrameworkName(data.frameworkName)
    } catch (error) {
      console.error('Error fetching summary:', error)
      setError('Failed to load decision summary. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  if (isLoading) return <div className="text-center mt-10">Loading summary...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Decision Summary</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-semibold my-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-medium my-2" {...props} />,
            p: ({node, ...props}) => <p className="my-2" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
          }}
          className="prose max-w-none"
        >
          {summary}
        </ReactMarkdown>
      </div>
      <p className="text-gray-600 mb-4">Framework: {frameworkName}</p>
      <div className="mt-6 flex justify-between">
        <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Back to Dashboard
        </Link>
        <Link href={`/decisions/${id}/view`} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          View Full Decision
        </Link>
      </div>
    </div>
  )
}