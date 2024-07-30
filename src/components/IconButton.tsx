import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, className, ...props }) => (
  <button
    className={`p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  >
    <Icon size={20} />
  </button>
);
