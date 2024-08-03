// src/components/ui/Textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, className, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
    <textarea
      id={id}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm ${className}`}
      {...props}
    />
  </div>
);

export default Textarea;