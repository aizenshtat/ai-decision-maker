'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewDecision() {
  const [question, setQuestion] = useState('')
  const [frameworkId, setFrameworkId] = useState('default')
  const [frameworks, setFrameworks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchFrameworks()
  }, [])

  const fetchFrameworks = async () => {
    try {
      const response = await fetch('/api/frameworks')
      if (!response.ok) throw new Error('Failed to fetch frameworks')
      const data = await response.json()
      setFrameworks(data)
    } catch (error) {
      console.error('Error fetching frameworks:', error)
      setError('Failed to load frameworks. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/decisions/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, frameworkId }),
      })

      if (!response.ok) {
        throw new Error('Failed to start decision')
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      router.push(`/decisions/${data.id}/steps/0`)
    } catch (error) {
      console.error('Error starting decision:', error)
      setError('Failed to start decision. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Start a New Decision</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block mb-2">What decision do you need help with?</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="framework" className="block mb-2">Select a Decision Framework</label>
          <select
            id="framework"
            value={frameworkId}
            onChange={(e) => setFrameworkId(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="default">Default Personal Decision Framework</option>
            {frameworks.map((framework) => (
              <option key={framework.id} value={framework.id}>{framework.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Processing...' : 'Start Decision Process'}
        </button>
      </form>
    </div>
  )
}