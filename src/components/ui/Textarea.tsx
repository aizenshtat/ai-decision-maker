// src/components/ui/Textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, className, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id} className="form-label">{label}</label>}
    <textarea
      id={id}
      className={`input-base ${className}`}
      {...props}
    />
  </div>
);

export default Textarea;