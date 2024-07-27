export interface Framework {
  id: string;
  name: string;
  description?: string;
  steps: Step[];
}

interface Step {
  title: string;
  description?: string;
  fields: Field[];
}

interface Field {
  name: string;
  label: string;
  type: string;
  // Add other properties as needed
}
