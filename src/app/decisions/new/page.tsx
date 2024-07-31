'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { handleClientError } from '@/utils/errorHandling'
import { Framework } from '@/types/framework'
import { Card, Button, Input, Select, Textarea } from '@/components/ui'

export default function NewDecision() {
  const [question, setQuestion] = useState('')
  const [frameworkId, setFrameworkId] = useState('')
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchFrameworks()
  }, [])

  const fetchFrameworks = async () => {
    try {
      const response = await fetch('/api/frameworks?includeArchived=false')
      if (!response.ok) throw new Error('Failed to fetch frameworks')
      const data = await response.json()
      const activeFrameworks = data.filter((framework: Framework) => !framework.archived)
      setFrameworks(activeFrameworks)
      if (activeFrameworks.length > 0) {
        setFrameworkId(activeFrameworks[0].id)
      }
    } catch (error) {
      setError(handleClientError(error))
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
      router.push(`/decisions/${data.id}/steps/0`)
    } catch (error) {
      setError(handleClientError(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Start a New Decision</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="question" className="form-label">What decision do you need help with?</label>
          <Textarea
            id="question"
            value={question}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
            required
            rows={4}
          />
        </div>
        <div className="form-group">
          <label htmlFor="framework" className="form-label">Select a Decision Framework</label>
          <Select
            id="framework"
            value={frameworkId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFrameworkId(e.target.value)}
            required
            options={[
              { value: "", label: "Select a framework" },
              ...frameworks.map((framework) => ({
                value: framework.id,
                label: framework.name,
              })),
            ]}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !frameworkId}
          className="w-full btn-primary"
        >
          {isLoading ? 'Processing...' : 'Start Decision Process'}
        </Button>
      </form>
    </Card>
  )
}