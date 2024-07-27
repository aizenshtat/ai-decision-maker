// src/app/layout.tsx

import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]/route'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

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
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">AI Decision Maker</Link>
            <div className="space-x-4">
              {session ? (
                <>
                  <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                  <Link href="/frameworks" className="hover:text-gray-300">Frameworks</Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-gray-300">Login</Link>
                  <Link href="/register" className="hover:text-gray-300">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}