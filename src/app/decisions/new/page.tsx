'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DecisionWizard from '@/components/DecisionWizard'
import { Framework } from '@/types/framework'
import { authenticatedFetch } from '@/utils/api'

export default function NewDecision() {
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchFrameworks()
  }, [])

  const fetchFrameworks = async () => {
    try {
      const response = await authenticatedFetch('/api/frameworks')
      if (response) {
        const data = await response.json()
        setFrameworks(data)
      }
    } catch (error) {
      setError('Failed to fetch frameworks')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (question: string, frameworkId: string) => {
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
      router.push(`/decisions/${data.id}/steps/0`)
    } catch (error) {
      setError('Failed to start decision. Please try again.')
    }
  }

  if (isLoading) return <div>Loading frameworks...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Start a New Decision</h1>
      <DecisionWizard frameworks={frameworks} onSubmit={handleSubmit} />
    </div>
  )
}