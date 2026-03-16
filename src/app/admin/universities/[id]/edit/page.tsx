"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import UniversityForm from '@/components/admin/UniversityForm'

export default function EditUniversityPage() {
  const params = useParams()
  const id = params.id as string
  const [university, setUniversity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await fetch(`/api/universities/${id}`)
        if (response.ok) {
          const data = await response.json()
          setUniversity(data)
        }
      } catch (error) {
        console.error('Error fetching university:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchUniversity()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading profile...
        </div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-400">
        University profile not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-7xl mx-auto">
        <UniversityForm initialData={university} isEditing={true} />
      </div>
    </div>
  )
}
