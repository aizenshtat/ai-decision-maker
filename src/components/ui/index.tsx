import React from 'react';

export const Card: React.FC<React.HTMLProps<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    className={`btn-primary ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, id, className, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id} className="form-label">{label}</label>}
    <input
      id={id}
      className={`input-base ${className}`}
      {...props}
    />
  </div>
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, id, className, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id} className="form-label">{label}</label>}
    <textarea
      id={id}
      className={`input-base ${className}`}
      {...props}
    />
  </div>
);

type SelectOption = string | { value: string; label: string };

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ label, id, className, options, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id} className="form-label">{label}</label>}
    <select
      id={id}
      className={`input-base ${className}`}
      {...props}
    >
      {options.map((option, index) => (
        <option key={index} value={typeof option === 'string' ? option : option.value}>
          {typeof option === 'string' ? option : option.label}
        </option>
      ))}
    </select>
  </div>
);

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className, ...props }) => (
  <label className={`form-label ${className}`} {...props}>
    {children}
  </label>
);

export const ErrorMessage: React.FC<React.HTMLProps<HTMLParagraphElement>> = ({ children, className, ...props }) => (
  <p className={`text-red-500 text-sm mt-1 ${className}`} {...props}>
    {children}
  </p>
);

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, className, ...props }) => (
  <button className={`p-2 rounded-full hover:bg-gray-200 ${className}`} {...props}>
    <Icon size={20} />
  </button>
);