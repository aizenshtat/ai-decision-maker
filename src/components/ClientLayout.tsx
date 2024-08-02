'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface ClientLayoutProps {
  children: React.ReactNode
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      {children}
    </div>
  )
}

export default ClientLayout