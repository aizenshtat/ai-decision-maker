import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({ label, id, className, options, ...props }) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      id={id}
      className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
