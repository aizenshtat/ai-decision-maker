// /src/types/decision.ts

import { Framework } from './framework';

export interface Decision {
  id: string;
  userId: string;
  question: string;
  frameworkId: string;
  framework: Framework;
  currentStep: number;
  createdAt: string;
  status: 'in_progress' | 'completed';
  data: any; // You might want to define a more specific type for this
  summary?: string | null;
}