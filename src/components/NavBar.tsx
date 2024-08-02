'use client'

import { useSession } from "next-auth/react"
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { useTheme } from '../contexts/ThemeContext';

export default function NavBar() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme();

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <nav className={`bg-white dark:bg-gray-800 shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="responsive-container flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">AI Decision Maker</h1>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">Dashboard</Link>
              <Link href="/decisions/new" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">New Decision</Link>
              <Link href="/frameworks" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">Frameworks</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">Login</Link>
              <Link href="/register" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">Register</Link>
            </>
          )}
        </div>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  )
}