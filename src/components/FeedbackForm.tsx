// src/components/FeedbackForm.tsx

import React, { useState } from 'react';
import { Button, Input, Textarea, ErrorMessage } from './ui';

interface FeedbackFormProps {
  decisionId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ decisionId, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      // Success message will be handled by the parent component
    } catch (error) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Rating</label>
        <div className="flex space-x-2 mt-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`p-2 rounded-full ${
                rating >= value ? 'bg-yellow-400' : 'bg-gray-200'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <Textarea
        id="feedback-comment"
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this decision process..."
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );
};

export default FeedbackForm;