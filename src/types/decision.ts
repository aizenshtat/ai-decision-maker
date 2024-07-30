// /src/types/decision.ts

export interface Decision {
  id: string;
  userId: string;
  question: string;
  frameworkId: string;
  framework: string;
  currentStep: number;
  totalSteps: number;
  createdAt: string;
  status: 'in_progress' | 'completed';
  data: any; // You might want to define a more specific type for this
  summary?: string;
}
