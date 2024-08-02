// src/components/AISuggestion.tsx
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';


interface AISuggestionProps {
  suggestion: string;
  onApply: (suggestion: string) => void;
}

const AISuggestion: React.FC<AISuggestionProps> = ({ suggestion, onApply }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <h3 className="text-lg font-semibold mb-2">AI Suggestion</h3>
      <p className={`mb-2 ${isExpanded ? '' : 'line-clamp-3'}`}>{suggestion}</p>
      <div className="flex justify-between">
        <Button onClick={() => setIsExpanded(!isExpanded)} variant="secondary">
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
        <Button onClick={() => onApply(suggestion)}>Apply Suggestion</Button>
      </div>
    </Card>
  );
};

export default AISuggestion;