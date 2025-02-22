// src/app/dashboard/page.tsx

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Decision } from '@/types/decision'
import { handleClientError } from '@/utils/errorHandling'
import FeedbackForm from '@/components/FeedbackForm'
import { handleExpiredSession } from '@/utils/sessionUtils'
import Modal from '@/components/Modal'
import Button from '@/components/ui/Button'
import { authenticatedFetch } from '@/utils/api'

export default function Dashboard() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const [showFeedbackForm, setShowFeedbackForm] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [decisionToDelete, setDecisionToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchDecisions()
  }, [])

  const fetchDecisions = async () => {
    try {
      const response = await authenticatedFetch('/api/decisions')
      if (!response) return; // Session expired and user is redirected
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
    setDecisionToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (decisionToDelete) {
      try {
        const response = await authenticatedFetch(`/api/decisions/${decisionToDelete}`, { method: 'DELETE' })
        if (!response) return; // Session expired and user is redirected
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        setDecisions(decisions.filter(decision => decision.id !== decisionToDelete))
      } catch (error) {
        setError(handleClientError(error))
      }
    }
    setIsDeleteModalOpen(false)
    setDecisionToDelete(null)
  }

  const handleFeedbackSubmit = async (decisionId: string, rating: number, comment: string) => {
    try {
      const response = await authenticatedFetch(`/api/decisions/${decisionId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })
      if (!response) return; // Session expired and user is redirected
      if (!response.ok) throw new Error('Failed to submit feedback');
      setShowFeedbackForm(null);
      fetchDecisions(); // Refresh the decisions list to show updated feedback
    } catch (error) {
      setError(handleClientError(error));
    }
  }

  if (isLoading) return <div className="text-center mt-10">Loading decisions...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Decisions</h1>
      <Link href="/decisions/new" className="btn-primary mb-6 inline-block">
        Start New Decision
      </Link>
      {decisions.length === 0 ? (
        <p className="text-center mt-10">You haven&apos;t made any decisions yet. Start a new one!</p>
      ) : (
        <div className="grid gap-6 mt-6">
          {decisions.map((decision) => (
            <div key={decision.id} className="card mb-4">
              <h2 className="text-xl font-semibold mb-2">{decision.question}</h2>
              <p className="text-gray-600 mb-2">Framework: {decision.framework.name}</p>
              <p className="text-gray-600 mb-2">Created: {new Date(decision.createdAt).toLocaleString()}</p>
              <p className="text-gray-600 mb-2">
                Status: {decision.status === 'completed' ? 'Completed' : `In Progress (Step ${decision.currentStep + 1})`}
              </p>
              {decision.feedback ? (
                <p className="text-gray-600 mb-2">Rating: {'★'.repeat(decision.feedback.rating)}</p>
              ) : decision.status === 'completed' && (
                <button
                  onClick={() => setShowFeedbackForm(decision.id)}
                  className="btn-secondary mr-2"
                >
                  Provide Feedback
                </button>
              )}
              {showFeedbackForm === decision.id && (
                <FeedbackForm
                  decisionId={decision.id}
                  onSubmit={(rating, comment) => handleFeedbackSubmit(decision.id, rating, comment)}
                />
              )}
              <div className="flex space-x-4">
                {decision.status === 'completed' ? (
                  <button
                    onClick={() => router.push(`/decisions/${decision.id}/summary`)}
                    className="btn-primary"
                  >
                    View Summary
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(`/decisions/${decision.id}/steps/${decision.currentStep}`)}
                    className="btn-primary"
                  >
                    Continue
                  </button>
                )}
                <button
                  onClick={() => handleDeleteDecision(decision.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        actions={
          <>
            <Button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-200 text-gray-800">Cancel</Button>
            <Button onClick={confirmDelete} className="bg-red-500 text-white">Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to delete this decision? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}