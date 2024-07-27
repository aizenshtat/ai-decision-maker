'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Framework {
  id: string;
  name: string;
  description: string;
  userId: string;
}

export default function Frameworks() {
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFrameworks()
  }, [])

  const fetchFrameworks = async () => {
    try {
      const response = await fetch('/api/frameworks')
      if (!response.ok) throw new Error('Failed to fetch frameworks')
      const data = await response.json()
      setFrameworks(data)
    } catch (error) {
      console.error('Error fetching frameworks:', error)
      setError('Failed to load frameworks. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFramework = async (id: string) => {
    try {
      const response = await fetch(`/api/frameworks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete framework');
      setFrameworks(frameworks.filter(framework => framework.id !== id));
    } catch (error) {
      console.error('Error deleting framework:', error);
      setError('Failed to delete framework. Please try again.');
    }
  }

  if (isLoading) return <div className="text-center mt-10">Loading frameworks...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Decision Frameworks</h1>
      <Link href="/frameworks/new" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-6 inline-block">
        Create New Framework
      </Link>
      <div className="grid gap-6 mt-6">
        {frameworks.map((framework) => (
          <div key={framework.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{framework.name}</h2>
            <p className="text-gray-600 mb-4">{framework.description}</p>
            {framework.id !== 'default' && (
              <>
                <Link href={`/frameworks/${framework.id}/edit`} className="text-blue-500 hover:text-blue-700 mr-4">
                  Edit
                </Link>
                <button onClick={() => handleDeleteFramework(framework.id)} className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}