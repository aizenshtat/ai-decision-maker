// src/app/decisions/[id]/feedback/page.tsx

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { handleClientError } from '@/utils/errorHandling'

export default function FeedbackSubmission() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/decisions/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      router.push('/dashboard')
    } catch (error) {
      setError(handleClientError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Provide Feedback</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">
            How helpful was this decision-making process?
          </label>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`text-3xl ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="comment">
            Additional Comments (optional)
          </label>
          <textarea
            id="comment"
            className="input-base"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="btn-primary disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}