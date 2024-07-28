export interface Framework {
  id: string;
  name: string;
  description?: string;
  steps: Step[];
}

export interface Step {
  title: string;
  description?: string;
  ai_instructions?: string;
  fields: Field[];
}

export interface Field {
  name: string;
  label: string;
  type: string;
  description?: string;
  placeholder?: string;
  object_structure?: ObjectStructure;
  matrix_structure?: MatrixStructure;
  cell_format?: CellFormat;
  validation?: Validation;
  dependencies?: Dependency | { [key: string]: Dependency };
}

export interface ObjectStructure {
  [key: string]: string | { type: string; min?: number; max?: number; step?: number };
}

export interface MatrixStructure {
  rows: string;
  columns: string;
}

export interface CellFormat {
  type: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface Validation {
  [key: string]: {
    max: number;
    message: string;
  };
}

export interface Dependency {
  step: string;
  field: string;
  use: string;
}