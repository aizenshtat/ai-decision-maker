// src/components/DecisionWizard.tsx
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Framework } from '@/types/framework';
import Onboarding from '@/components/Onboarding';

interface DecisionWizardProps {
  frameworks: Framework[];
  onSubmit: (question: string, frameworkId: string) => void;
}

const DecisionWizard: React.FC<DecisionWizardProps> = ({ frameworks, onSubmit }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(0);
  const [question, setQuestion] = useState('');
  const [frameworkId, setFrameworkId] = useState('');

  const steps = [
    {
      title: 'Define Your Decision',
      content: (
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            What decision do you need to make?
          </label>
          <input
            type="text"
            id="question"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
      ),
    },
    {
      title: 'Choose a Framework',
      content: (
        <div>
          <label htmlFor="framework" className="block text-sm font-medium text-gray-700">
            Select a decision-making framework
          </label>
          <select
            id="framework"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={frameworkId}
            onChange={(e) => setFrameworkId(e.target.value)}
          >
            <option value="">Select a framework</option>
            {frameworks.map((framework) => (
              <option key={framework.id} value={framework.id}>
                {framework.name}
              </option>
            ))}
          </select>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onSubmit(question, frameworkId);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{steps[step].title}</h2>
        <div className="mt-4 mb-8">{steps[step].content}</div>
      </div>
      <div className="flex justify-between">
        <Button onClick={handleBack} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={handleNext}>
          {step === steps.length - 1 ? 'Start Decision' : 'Next'}
        </Button>
      </div>
    </Card>
  );
};

export default DecisionWizard;