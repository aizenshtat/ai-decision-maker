'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Framework } from '@/types/framework'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { validateInput, required } from '@/utils/validation'

export default function NewFramework() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { [key: string]: string[] } = {
      name: validateInput(name, [required]),
    }

    setErrors(newErrors)
    return Object.values(newErrors).every(fieldErrors => fieldErrors.length === 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const response = await fetch('/api/frameworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, steps: [] } as Partial<Framework>),
      })

      if (!response.ok) {
        throw new Error('Failed to create framework')
      }

      const data: Framework = await response.json()
      router.push(`/frameworks/${data.id}`)
    } catch (error) {
      console.error('Error creating framework:', error)
      setErrors({ form: ['Failed to create framework. Please try again.'] })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Create New Framework</h1>
      {errors.form && errors.form.map((error, index) => (
        <p key={index} className="text-red-500 mb-4">{error}</p>
      ))}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Framework Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && errors.name.map((error, index) => (
            <p key={index} className="text-red-500 text-xs italic">{error}</p>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary"
        >
          {isLoading ? 'Creating...' : 'Create Framework'}
        </Button>
      </form>
    </Card>
  )
}