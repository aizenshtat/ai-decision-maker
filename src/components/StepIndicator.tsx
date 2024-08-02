// src/components/StepIndicator.tsx
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center space-x-2 my-4">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`w-3 h-3 rounded-full ${
          index < currentStep ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      />
    ))}
  </div>
);

export default StepIndicator;