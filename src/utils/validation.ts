// src/utils/validation.ts

export const validateInput = (value: string, rules: ValidationRule[]): string[] => {
    return rules.reduce((errors: string[], rule) => {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
      return errors;
    }, []);
  };
  
  export interface ValidationRule {
    validate: (value: string) => boolean;
    message: string;
  }
  
  export const required: ValidationRule = {
    validate: (value: string) => value.trim().length > 0,
    message: 'This field is required',
  };
  
  export const minLength = (length: number): ValidationRule => ({
    validate: (value: string) => value.length >= length,
    message: `Must be at least ${length} characters long`,
  });
  
  export const maxLength = (length: number): ValidationRule => ({
    validate: (value: string) => value.length <= length,
    message: `Must not exceed ${length} characters`,
  });
  
  export const isEmail: ValidationRule = {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Must be a valid email address',
  };
  
  export const isNumber: ValidationRule = {
    validate: (value: string) => !isNaN(Number(value)),
    message: 'Must be a valid number',
  };
  
  export const isPositiveNumber: ValidationRule = {
    validate: (value: string) => Number(value) > 0,
    message: 'Must be a positive number',
  };