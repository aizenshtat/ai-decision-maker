import React from 'react';

export const ErrorMessage: React.FC<React.HTMLProps<HTMLParagraphElement>> = ({ children, className, ...props }) => (
    <p className={`text-red-500 text-sm mt-1 ${className}`} {...props}>
      {children}
    </p>
  );