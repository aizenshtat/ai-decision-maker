// src/app/layout.tsx

import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]/options'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import NavBar from '@/components/NavBar'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Decision Maker',
  description: 'Make better decisions with AI assistance',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <NavBar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </body>
      </Providers>
    </html>
  )
}