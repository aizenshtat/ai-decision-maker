'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import NavBar from '@/components/NavBar'
import { useTheme } from '@/contexts/ThemeContext'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()

  return (
    <html lang="en">
      <body className={`${inter.className} ${theme}`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 md:ml-64 pt-16 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <footer className="bg-white dark:bg-gray-800 py-4 mt-auto">
              <div className="container mx-auto px-4 text-gray-900 dark:text-gray-100 text-center">
                <p className="text-sm">© {new Date().getFullYear()} AI Decision Maker</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}