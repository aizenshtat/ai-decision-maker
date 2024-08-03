import React from 'react';
import { Decision } from '@/types/decision';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

interface DecisionCardProps {
  decision: Decision;
  onDelete?: (id: string) => void;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onDelete }) => (
  <Card className="transition-all hover:shadow-lg">
    <h3 className="text-lg font-semibold mb-2">{decision.question}</h3>
    <p className="text-sm text-gray-600 mb-4">Framework: {decision.framework.name}</p>
    <div className="flex justify-between">
      <Link href={`/decisions/${decision.id}/${decision.status === 'completed' ? 'summary' : `steps/${decision.currentStep}`}`}>
        <Button variant="outline">
          {decision.status === 'completed' ? 'View Summary' : 'Continue'}
        </Button>
      </Link>
      {onDelete && (
        <Button variant="outline" onClick={() => onDelete(decision.id)} className="text-red-500">
          Delete
        </Button>
      )}
    </div>
  </Card>
);

export default DecisionCard;