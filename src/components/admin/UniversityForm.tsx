"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  X, 
  Info, 
  Layers, 
  MapPin, 
  Globe, 
  Trophy, 
  Users, 
  UserCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface UniversityFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function UniversityForm({ initialData, isEditing = false }: UniversityFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    type: initialData?.type || 'PRIVATE',
    website: initialData?.website || '',
    logo: initialData?.logo || '',
    logoColor: initialData?.logoColor || 'bg-primary',
    description: initialData?.description || '',
    specialties: initialData?.specialties?.join(', ') || '',
    ranking: initialData?.ranking || '',
    qsRanking: initialData?.qsRanking || '',
    acceptanceRate: initialData?.acceptanceRate || '',
    enrollmentSize: initialData?.enrollmentSize || '',
    counselorName: initialData?.counselorName || '',
    counselorTitle: initialData?.counselorTitle || '',
    category: initialData?.category || 'tech',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        id: initialData?.id,
        ranking: parseInt(formData.ranking.toString()) || null,
        enrollmentSize: parseInt(formData.enrollmentSize.toString()) || null,
        acceptanceRate: parseFloat(formData.acceptanceRate.toString()) || null,
        specialties: formData.specialties.split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
      }

      const url = isEditing ? `/api/admin/universities/${initialData.id}` : '/api/admin/universities'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push('/admin/universities')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error saving university:', error)
      alert('Failed to save university profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const sectionStyle = "bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 mb-6"
  const labelStyle = "block text-sm font-medium text-gray-400 mb-2"
  const inputStyle = "bg-[#050505] border-gray-800 text-white focus:border-primary/50"

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-[#050505]/80 backdrop-blur py-4 border-b border-gray-800/50">
        <div>
          <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit University' : 'Add New University'}</h1>
          <p className="text-sm text-gray-500">Define the profile and recruitment details</p>
        </div>
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white gap-2 px-6"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? 'Update Profile' : 'Create Profile'}
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <div className={sectionStyle}>
        <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
          <Info className="h-4 w-4" /> 
          <h3>Basic Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelStyle}>University Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} required className={inputStyle} placeholder="e.g. Massachusetts Institute of Technology" />
          </div>
          <div>
            <label className={labelStyle}>City</label>
            <Input name="city" value={formData.city} onChange={handleChange} required className={inputStyle} placeholder="e.g. Cambridge" />
          </div>
          <div>
            <label className={labelStyle}>State / Province</label>
            <Input name="state" value={formData.state} onChange={handleChange} required className={inputStyle} placeholder="e.g. MA" />
          </div>
          <div>
            <label className={labelStyle}>University Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className={cn(inputStyle, "w-full rounded-md h-10 px-3 py-2 text-sm outline-none")}>
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>
          <div>
            <label className={labelStyle}>Website URL</label>
            <Input name="website" type="url" value={formData.website} onChange={handleChange} className={inputStyle} placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* Visual Workspace Identity */}
      <div className={sectionStyle}>
        <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
          <Layers className="h-4 w-4" /> 
          <h3>Visual Identity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Logo Text / Initial</label>
            <Input name="logo" value={formData.logo} onChange={handleChange} className={inputStyle} placeholder="e.g. MIT" />
          </div>
          <div>
            <label className={labelStyle}>Brand Color (Tailwind class)</label>
            <Input name="logoColor" value={formData.logoColor} onChange={handleChange} className={inputStyle} placeholder="e.g. bg-red-600" />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Category Tag</label>
            <Input name="category" value={formData.category} onChange={handleChange} className={inputStyle} placeholder="e.g. tech, ivy, public" />
          </div>
        </div>
      </div>

      {/* Academic Rankings & Stats */}
      <div className={sectionStyle}>
        <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
          <Trophy className="h-4 w-4" /> 
          <h3>Rankings & Statistics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>National Ranking (Numeric)</label>
            <Input name="ranking" type="number" value={formData.ranking} onChange={handleChange} className={inputStyle} placeholder="e.g. 2" />
          </div>
          <div>
            <label className={labelStyle}>QS World Ranking (Text Display)</label>
            <Input name="qsRanking" value={formData.qsRanking} onChange={handleChange} className={inputStyle} placeholder="e.g. #1 QS World Rankings" />
          </div>
          <div>
            <label className={labelStyle}>Acceptance Rate (%)</label>
            <Input name="acceptanceRate" value={formData.acceptanceRate} onChange={handleChange} className={inputStyle} placeholder="e.g. 4.1" />
          </div>
          <div>
            <label className={labelStyle}>Total Enrollment</label>
            <Input name="enrollmentSize" type="number" value={formData.enrollmentSize} onChange={handleChange} className={inputStyle} placeholder="e.g. 11934" />
          </div>
        </div>
      </div>

      {/* Counselor Profile */}
      <div className={sectionStyle}>
        <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
          <UserCircle className="h-4 w-4" /> 
          <h3>Lead Counselor / Admissions Rep</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Contact Name</label>
            <Input name="counselorName" value={formData.counselorName} onChange={handleChange} className={inputStyle} placeholder="e.g. John Doe" />
          </div>
          <div>
            <label className={labelStyle}>Contact Title</label>
            <Input name="counselorTitle" value={formData.counselorTitle} onChange={handleChange} className={inputStyle} placeholder="e.g. Dean of Admissions" />
          </div>
        </div>
      </div>

      {/* Metadata & Description */}
      <div className={sectionStyle}>
        <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
          <Globe className="h-4 w-4" /> 
          <h3>Detailed Content</h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className={labelStyle}>Key Specialties (Comma separated)</label>
            <Input name="specialties" value={formData.specialties} onChange={handleChange} className={inputStyle} placeholder="Engineering, Physics, ..." />
          </div>
          <div>
            <label className={labelStyle}>Full University Description</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} rows={5} className={cn(inputStyle, "resize-none")} placeholder="Describe the university's history, culture, and unique offerings..." />
          </div>
        </div>
      </div>
    </form>
  )
}
