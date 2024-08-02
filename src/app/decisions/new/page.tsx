'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Framework } from '@/types/framework'
import { handleClientError } from '@/utils/errorHandling'

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
      const response = await fetch('/api/frameworks')
      if (!response.ok) throw new Error('Failed to fetch frameworks')
      const data = await response.json()
      setFrameworks(data)
      if (data.length > 0) {
        setFrameworkId(data[0].id)
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
    <Layout>
      <div className="max-w-md mx-auto mt-10">
        <Card>
          <h1 className="text-2xl font-bold mb-5">Start a New Decision</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="question"
              label="What decision do you need help with?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <Select
              id="framework"
              label="Select a Decision Framework"
              value={frameworkId}
              onChange={(e) => setFrameworkId(e.target.value)}
              required
              options={frameworks.map((framework) => ({
                value: framework.id,
                label: framework.name,
              }))}
            />
            <Button
              type="submit"
              disabled={isLoading || !frameworkId}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Start Decision Process'}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  )
}