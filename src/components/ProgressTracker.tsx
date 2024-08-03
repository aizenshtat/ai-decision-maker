import React from 'react';
import Card from '@/components/ui/Card';
import { Decision } from '@/types/decision';

interface ProgressTrackerProps {
  decisions: Decision[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ decisions }) => {
  const inProgressDecisions = decisions.filter(d => d.status === 'in_progress');

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Progress Tracker</h2>
      <div className="space-y-2">
        {inProgressDecisions.slice(0, 3).map(decision => (
          <div key={decision.id} className="flex items-center justify-between">
            <span className="text-sm truncate">{decision.question}</span>
            <span className="text-xs text-gray-500">
              Step {decision.currentStep + 1}/{decision.framework.steps.length}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProgressTracker;