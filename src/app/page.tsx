'use client'

import { useSession } from "next-auth/react"
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">AI Decision Maker</h1>
      {session ? (
        <div>
          <p className="mb-4">Welcome, {session.user?.name || 'User'}!</p>
          <Link href="/decisions/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Start a New Decision
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-4">Please log in or register to use the AI Decision Maker.</p>
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
            Login
          </Link>
          <Link href="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Register
          </Link>
        </div>
      )}
    </div>
  )
}