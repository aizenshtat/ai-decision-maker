'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { handleClientError } from '@/utils/errorHandling'
import { Framework } from '@/types/framework'
import FrameworkCard from '@/components/FrameworkCard'
import { authenticatedFetch } from '@/utils/api'
import Button from '@/components/ui/Button'

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
      const response = await authenticatedFetch('/api/frameworks?includeArchived=true')
      if (!response) return; // Session expired and user is redirected
      if (!response.ok) throw new Error('Failed to fetch frameworks')
      const data = await response.json()
      setFrameworks(data)
    } catch (error) {
      setError(handleClientError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFramework = async (id: string) => {
    try {
      const response = await fetch(`/api/frameworks/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.status === 400 && result.canArchive) {
        if (confirm(result.message)) {
          await archiveFramework(id);
        }
      } else if (response.ok) {
        console.log(result.message);
        setFrameworks(frameworks.filter(framework => framework.id !== id));
      } else {
        throw new Error(result.message || 'Failed to delete framework');
      }
    } catch (error) {
      setError(handleClientError(error));
    }
  }

  const archiveFramework = async (id: string) => {
    try {
      const response = await fetch(`/api/frameworks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ archived: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to archive framework');
      }

      const updatedFramework = await response.json();
      setFrameworks(frameworks.map(framework => 
        framework.id === id ? { ...framework, archived: true } : framework
      ));
    } catch (error) {
      setError(handleClientError(error));
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
      setError(handleClientError(error));
    }
  }

  if (isLoading) return <div className="text-center mt-10">Loading frameworks...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Frameworks</h1>
        <Link href="/frameworks/new">
          <Button className="mb-6">Add New Framework</Button>
        </Link>
        <div className="grid gap-6">
          <h2 className="text-2xl font-semibold">Active Frameworks</h2>
          {frameworks.filter(framework => !framework.archived).map((framework) => (
            <FrameworkCard
              key={framework.id}
              framework={framework}
              onDelete={handleDeleteFramework}
              onClone={handleCloneFramework}
              onArchive={archiveFramework}
              isArchived={false}
            />
          ))}
        </div>
        {frameworks.some(framework => framework.archived) && (
          <div className="grid gap-6 mt-6">
            <h2 className="text-2xl font-semibold">Archived Frameworks</h2>
            {frameworks.filter(framework => framework.archived).map((framework) => (
              <FrameworkCard
                key={framework.id}
                framework={framework}
                onDelete={handleDeleteFramework}
                onClone={handleCloneFramework}
                onArchive={archiveFramework}
                isArchived={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}