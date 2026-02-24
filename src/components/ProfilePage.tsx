"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  GraduationCap, 
  Globe, 
  Calendar,
  BookOpen,
  DollarSign,
  User,
  Mail,
  Shield,
  Bell,
  Moon,
  Sun,
  Check,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserProfile {
  id: string
  name: string
  email: string
  nickname?: string
  currentEducation?: string
  targetCountries?: string[]
  studyTimeline?: string
  preferredCourse?: string
  budget?: string
  onboardingCompleted: boolean
}

const educationOptions = ['High School (12th)', "Bachelor's Degree", "Master's Degree", 'Working Professional']
const countryOptions = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Other']
const timelineOptions = ['This Year', 'Next Year', '2+ Years', 'Just Exploring']
const courseOptions = ['Engineering', 'Business & Management', 'Computer Science', 'Medicine', 'Arts & Design', 'Sciences', 'Other']
const budgetOptions = ['< $20,000', '$20,000 - $40,000', '$40,000 - $60,000', '> $60,000', 'Need guidance']

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditedProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSave = async () => {
    if (!editedProfile) return
    
    setIsSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Chat
              </Button>
              <h1 className="text-xl font-semibold text-white">My Profile</h1>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-orange-500" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400">Full Name</Label>
                  <Input
                    value={editedProfile?.name || ''}
                    disabled
                    className="mt-1 bg-background border-gray-800 text-gray-300"
                  />
                </div>

                <div>
                  <Label className="text-gray-400">Email</Label>
                  <Input
                    value={editedProfile?.email || ''}
                    disabled
                    className="mt-1 bg-background border-gray-800 text-gray-300"
                  />
                </div>

                <div>
                  <Label className="text-gray-400">Preferred Name</Label>
                  <Input
                    value={editedProfile?.nickname || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile!, nickname: e.target.value })}
                    disabled={!isEditing}
                    placeholder="How should Maya address you?"
                    className="mt-1 bg-background border-gray-800 text-white"
                  />
                </div>
              </div>
            </motion.div>

            {/* Academic Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-orange-500" />
                Academic Profile
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400">Current Education Level</Label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.currentEducation || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile!, currentEducation: e.target.value })}
                      className="mt-1 w-full px-3 py-2 bg-background border border-gray-800 rounded-md text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Select education level</option>
                      {educationOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-white">{profile.currentEducation || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-400">Preferred Course/Field</Label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.preferredCourse || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile!, preferredCourse: e.target.value })}
                      className="mt-1 w-full px-3 py-2 bg-background border border-gray-800 rounded-md text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Select preferred course</option>
                      {courseOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-white">{profile.preferredCourse || 'Not set'}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Study Abroad Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-500" />
                Study Abroad Plans
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400">Target Countries</Label>
                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      {countryOptions.map(country => (
                        <label key={country} className="flex items-center gap-2 text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editedProfile?.targetCountries?.includes(country) || false}
                            onChange={(e) => {
                              const countries = editedProfile?.targetCountries || []
                              if (e.target.checked) {
                                setEditedProfile({ 
                                  ...editedProfile!, 
                                  targetCountries: [...countries, country] 
                                })
                              } else {
                                setEditedProfile({ 
                                  ...editedProfile!, 
                                  targetCountries: countries.filter(c => c !== country) 
                                })
                              }
                            }}
                            className="rounded border-gray-600 bg-background text-orange-500 focus:ring-orange-500"
                          />
                          {country}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-white">
                      {profile.targetCountries?.join(', ') || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-400">Study Timeline</Label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.studyTimeline || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile!, studyTimeline: e.target.value })}
                      className="mt-1 w-full px-3 py-2 bg-background border border-gray-800 rounded-md text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Select timeline</option>
                      {timelineOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-white">{profile.studyTimeline || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-400">Budget Range (per year)</Label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.budget || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile!, budget: e.target.value })}
                      className="mt-1 w-full px-3 py-2 bg-background border border-gray-800 rounded-md text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Select budget</option>
                      {budgetOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-white">{profile.budget || 'Not set'}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Profile Card & Settings */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center"
            >
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl bg-orange-500/20 text-orange-500">
                  {profile.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-white">{profile.nickname || profile.name}</h3>
              <p className="text-gray-400">{profile.email}</p>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Profile Completion</span>
                  <span className="text-orange-500 font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </motion.div>

            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-500" />
                Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <span className="text-white">Notifications</span>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      notifications ? "bg-orange-500" : "bg-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        notifications ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-gray-400" />
                    <span className="text-white">Dark Mode</span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      darkMode ? "bg-orange-500" : "bg-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        darkMode ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-orange-500/10 backdrop-blur-sm rounded-xl p-4 border border-orange-500/20"
            >
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Your Privacy Matters</h3>
                  <p className="text-sm text-gray-300">
                    Your profile information helps Maya provide personalized guidance. 
                    We never share your data with third parties.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}