// src/app/dashboard/page.tsx

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Decision } from '@/types/decision'
import { handleClientError } from '@/utils/errorHandling'

export default function Dashboard() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchDecisions()
  }, [])

  const fetchDecisions = async () => {
    try {
      const response = await fetch('/api/decisions')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setDecisions(data)
    } catch (error) {
      setError(handleClientError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDecision = async (id: string) => {
    if (confirm('Are you sure you want to delete this decision?')) {
      try {
        const response = await fetch(`/api/decisions/${id}`, { method: 'DELETE' })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        setDecisions(decisions.filter(decision => decision.id !== id))
      } catch (error) {
        setError(handleClientError(error))
      }
    }
  }

  if (isLoading) return <div className="text-center mt-10">Loading decisions...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Decisions</h1>
      <Link href="/decisions/new" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-6 inline-block">
        Start New Decision
      </Link>
      {decisions.length === 0 ? (
        <p className="text-center mt-10">You haven&apos;t made any decisions yet. Start a new one!</p>
      ) : (
        <div className="grid gap-6 mt-6">
          {decisions.map((decision) => (
            <div key={decision.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{decision.question}</h2>
              <p className="text-gray-600 mb-2">Framework: {decision.framework}</p>
              <p className="text-gray-600 mb-2">Created: {new Date(decision.createdAt).toLocaleString()}</p>
              <p className="text-gray-600 mb-4">
                Status: {decision.status === 'completed' ? 'Completed' : `In Progress (Step ${decision.currentStep + 1} of ${decision.totalSteps})`}
              </p>
              <div className="flex space-x-4">
                {decision.status === 'completed' ? (
                  <button
                    onClick={() => router.push(`/decisions/${decision.id}/summary`)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    View Summary
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(`/decisions/${decision.id}/steps/${decision.currentStep}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Continue
                  </button>
                )}
                <button
                  onClick={() => handleDeleteDecision(decision.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}