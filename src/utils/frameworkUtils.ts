import { Step } from '@/types/framework';

export function parseSteps(steps: any): Step[] {
  if (typeof steps === 'string') {
    try {
      return JSON.parse(steps);
    } catch {
      return [];
    }
  }
  if (Array.isArray(steps)) {
    return steps;
  }
  return [];
}
