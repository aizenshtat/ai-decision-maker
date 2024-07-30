// src/app/decisions/[id]/summary/page.tsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { handleClientError } from '@/utils/errorHandling'
import FeedbackForm from '@/components/FeedbackForm'

export default function DecisionSummary() {
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [frameworkName, setFrameworkName] = useState('')
  const params = useParams()
  const { id } = params as { id: string }

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<{ rating: number; comment?: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`/api/decisions/${id}/summary`)
      if (!response.ok) throw new Error('Failed to fetch summary')
      const data = await response.json()
      setSummary(data.summary)
      setFrameworkName(data.frameworkName)
      if (data.feedback) {
        setExistingFeedback(data.feedback)
        setFeedbackSubmitted(true)
      } else {
        setExistingFeedback(null)
        setFeedbackSubmitted(false)
      }
    } catch (error) {
      setError(handleClientError(error))
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    try {
      const response = await fetch(`/api/decisions/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      setFeedbackSubmitted(true);
      setExistingFeedback({ rating, comment });
      setSuccessMessage('Thank you for your feedback!');
      setShowFeedbackForm(false);
    } catch (error) {
      setError(handleClientError(error));
    }
  };

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
      
      {successMessage && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      {existingFeedback ? (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Your Feedback</h2>
          <p>Rating: {'★'.repeat(existingFeedback.rating)}</p>
          {existingFeedback.comment && <p>Comment: {existingFeedback.comment}</p>}
        </div>
      ) : !feedbackSubmitted && !showFeedbackForm && (
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Provide Feedback
        </button>
      )}
      
      {showFeedbackForm && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Feedback</h2>
          <FeedbackForm decisionId={id} onSubmit={handleFeedbackSubmit} />
        </div>
      )}
      
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