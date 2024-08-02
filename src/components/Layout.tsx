// src/components/Layout.tsx
import React, { ReactNode } from 'react';

import ErrorBoundary from './ErrorBoundary';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">

    <main className="flex-1 md:ml-64 pt-16 px-4 sm:px-6 lg:px-8">
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto">{children}</div>
      </ErrorBoundary>
    </main>
  </div>
);

export default Layout;