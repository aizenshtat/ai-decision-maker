// src/components/Layout.tsx
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900">
    {children}
  </div>
);

export default Layout;