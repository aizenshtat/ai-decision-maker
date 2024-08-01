'use client'

import { useSession } from "next-auth/react"
import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function NavBar() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
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
  )
}