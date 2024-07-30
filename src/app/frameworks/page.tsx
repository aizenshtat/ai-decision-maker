'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

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
    if (confirm('Are you sure you want to delete this framework?')) {
      try {
        const response = await fetch(`/api/frameworks/${id}`, { 
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete framework');
        }
        
        const result = await response.json();
        console.log(result.message); // Log the success message
        
        setFrameworks(frameworks.filter(framework => framework.id !== id));
      } catch (error) {
        console.error('Error deleting framework:', error);
        setError('Failed to delete framework. Please try again.');
      }
    }
  }

  const handleCloneFramework = async (id: string) => {
    try {
      const response = await fetch('/api/frameworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cloneFrom: id }),
      });
      if (!response.ok) throw new Error('Failed to clone framework');
      const newFramework = await response.json();
      setFrameworks([newFramework, ...frameworks]);
    } catch (error) {
      console.error('Error cloning framework:', error);
      setError('Failed to clone framework. Please try again.');
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
            <div className="flex space-x-4">
              <Link href={`/frameworks/${framework.id}`} className="text-blue-500 hover:text-blue-700">
                View Details
              </Link>
              {framework.id !== 'default' && (
                <button onClick={() => handleDeleteFramework(framework.id)} className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              )}
              <button onClick={() => handleCloneFramework(framework.id)} className="text-green-500 hover:text-green-700">
                Clone
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}