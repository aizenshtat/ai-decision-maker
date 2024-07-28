import React from 'react';

export const Card: React.FC<React.HTMLProps<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-md rounded-lg p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded-md transition duration-150 ease-in-out ${
      props.disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      id={id}
      className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  </div>
);

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className, ...props }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>
    {children}
  </label>
);

export const ErrorMessage: React.FC<React.HTMLProps<HTMLParagraphElement>> = ({ children, className, ...props }) => (
  <p className={`text-red-500 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, className, ...props }) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      id={id}
      className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  </div>
);

import { IconButton } from '../IconButton';
import { Select } from '../Select';

export { IconButton, Select };