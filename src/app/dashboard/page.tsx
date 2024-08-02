'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Decision } from '@/types/decision'
import { handleClientError } from '@/utils/errorHandling'
import { authenticatedFetch } from '@/utils/api'

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
      const response = await authenticatedFetch('/api/decisions')
      if (!response) return; // Session expired and user is redirected
      const data = await response.json()
      setDecisions(data)
    } catch (error) {
      setError(handleClientError(error))
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="text-center mt-10">Loading decisions...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Your Decisions</h1>
      <Link href="/decisions/new">
        <Button className="mb-6">Start New Decision</Button>
      </Link>
      {decisions.length === 0 ? (
        <p className="text-center mt-10">You haven't made any decisions yet. Start a new one!</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {decisions.map((decision) => (
              <Card key={decision.id} className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{decision.question}</h2>
                <p className="text-gray-600 mb-2">Framework: {decision.framework.name}</p>
                <p className="text-gray-600 mb-2">Created: {new Date(decision.createdAt).toLocaleString()}</p>
                <p className="text-gray-600 mb-2">
                  Status: {decision.status === 'completed' ? 'Completed' : `In Progress (Step ${decision.currentStep + 1})`}
                </p>
                <div className="flex space-x-4">
                  {decision.status === 'completed' ? (
                    <Button onClick={() => router.push(`/decisions/${decision.id}/summary`)}>
                      View Summary
                    </Button>
                  ) : (
                    <Button onClick={() => router.push(`/decisions/${decision.id}/steps/${decision.currentStep}`)}>
                      Continue
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}