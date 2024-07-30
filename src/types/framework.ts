export interface Framework {
  id: string;
  name: string;
  description: string | null;
  steps: Step[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
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
  type: FieldType;
  description?: string;
  placeholder?: string;
  object_structure?: ObjectStructure;
  matrix_structure?: MatrixStructure;
  cell_format?: CellFormat;
  validation?: Validation;
  dependencies?: {
    [key: string]: Dependency;
  } | Dependency;
}

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'list' | 'list_of_objects' | 'matrix';

export interface ObjectStructure {
  [key: string]: string | {
    type: string;
    min?: number;
    max?: number;
    step?: number;
    dependency?: {
      step: string;
      field: string;
      use: string;
    };
  };
}

export interface MatrixStructure {
  rows: string;
  columns: string;
}

export interface CellFormat {
  type: 'number' | 'text' | 'select';
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