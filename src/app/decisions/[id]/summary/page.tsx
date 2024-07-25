// src/app/decisions/[id]/summary/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function DecisionSummary() {
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()
  const { id } = params

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`/api/decisions/${id}/summary`)
      if (!response.ok) throw new Error('Failed to fetch summary')
      const data = await response.json()
      setSummary(data.summary)
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
        <div dangerouslySetInnerHTML={{ __html: summary }} className="prose" />
      </div>
      <div className="mt-6 flex justify-between">
        <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Back to Dashboard
        </Link>
        <Link href={`/decisions/${id}/feedback`} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Provide Feedback
        </Link>
      </div>
    </div>
  )
}