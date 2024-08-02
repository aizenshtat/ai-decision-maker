// src/components/Feedback.tsx
import React, { useState } from 'react';
import { Card, Button, Textarea } from '@/components/ui';

const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement feedback submission to backend
    console.log('Feedback submitted:', feedback);
    setFeedback('');
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Provide Feedback</h2>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your feedback helps us improve. Let us know what you think!"
          className="mb-4"
        />
        <Button type="submit">Submit Feedback</Button>
      </form>
    </Card>
  );
};

export default Feedback;