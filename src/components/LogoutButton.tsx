// src/components/LogoutButton.tsx

'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-red-500 text-white p-2 rounded"
    >
      Logout
    </button>
  )
}