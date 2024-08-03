// src/components/Onboarding.tsx
import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: 'Welcome to AI Decision Maker',
    content: 'This app helps you make better decisions using AI assistance.',
  },
  {
    title: 'Create a Decision',
    content: 'Start by creating a new decision and choosing a framework.',
  },
  {
    title: 'Follow the Steps',
    content: 'Go through each step of the framework, providing information as requested.',
  },
  {
    title: 'Get AI Suggestions',
    content: 'Receive AI-powered suggestions to help you make informed choices.',
  },
  {
    title: 'Review and Decide',
    content: 'Review your inputs and the AI suggestions to make your final decision.',
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">{onboardingSteps[currentStep].title}</h2>
      <p className="mb-6">{onboardingSteps[currentStep].content}</p>
      <div className="flex justify-between">
        <Button onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </Card>
  );
};

export default Onboarding;