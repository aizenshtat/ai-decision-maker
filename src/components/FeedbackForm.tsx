// src/components/FeedbackForm.tsx

import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import { ErrorMessage } from './ui/ErrorMessage';
import { validateInput, required, isNumber, isPositiveNumber } from '@/utils/validation';

interface FeedbackFormProps {
  decisionId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ decisionId, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string[] } = {
      rating: validateInput(rating.toString(), [required, isNumber, isPositiveNumber]),
      comment: validateInput(comment, []),
    }

    setErrors(newErrors)
    return Object.values(newErrors).every(fieldErrors => fieldErrors.length === 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      // Success message will be handled by the parent component
    } catch (error) {
      setErrors({ form: ['Failed to submit feedback. Please try again.'] });
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
        {errors.rating && errors.rating.map((error, index) => (
          <ErrorMessage key={index}>{error}</ErrorMessage>
        ))}
      </div>
      <Textarea
        id="feedback-comment"
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this decision process..."
      />
      {errors.form && errors.form.map((error, index) => (
        <ErrorMessage key={index}>{error}</ErrorMessage>
      ))}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );
};

export default FeedbackForm;