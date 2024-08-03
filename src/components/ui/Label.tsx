import React from 'react';

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className, ...props }) => (
    <label className={`form-label ${className}`} {...props}>
      {children}
    </label>
  );
  