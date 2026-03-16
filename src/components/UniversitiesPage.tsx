"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { ChevronRight, Home, Compass, GraduationCap } from "lucide-react"
import { cn } from '@/lib/utils'
import MayaCommandBar from "./MayaCommandBar"
import AppSidebar from './AppSidebar'
import type { NavItem } from './AppSidebar'

interface University {
  id: string
  name: string
  location: string
  specialty: string
  studentCount: string
  logo: string
  logoColor: string
  category: string
  description: string
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Explore People", icon: Compass, href: "/explore" },
  { label: "Universities", icon: GraduationCap, href: "/universities" },
]

export default function UniversitiesPage() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('/api/universities')
        if (response.ok) {
          const data = await response.json()
          // Map DB fields to UI interface if needed
          const mappedData = data.map((u: any) => ({
            id: u.id,
            name: u.name,
            location: `${u.city}, ${u.state}`,
            specialty: u.specialties?.[0] || 'General',
            studentCount: `${u.enrollmentSize?.toLocaleString()} students`,
            logo: u.logo,
            logoColor: u.logoColor,
            category: u.category || 'tech',
            description: u.description
          }))
          setUniversities(mappedData)
        }
      } catch (error) {
        console.error('Error fetching universities:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUniversities()
  }, [])

  const categories = [
    { id: "for-you", title: "For You", universities: universities.slice(0, 8) },
    { id: "ivy", title: "Ivy League Schools", universities: universities.filter(u => u.category === "ivy") },
    { id: "tech", title: "Tech-Focused Universities", universities: universities.filter(u => u.category === "tech") },
    { id: "public", title: "Top Public Universities", universities: universities.filter(u => u.category === "public") },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setIsScrolled(contentRef.current.scrollTop > 10)
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleUniversityClick = (university: University) => {
    router.push(`/university/${university.id}`)
  }

  const UniversityCard = ({ university }: { university: University }) => (
    <div
      className="group relative bg-[#0f0f0f] rounded-xl border border-gray-800/50 overflow-hidden hover:bg-[#151515] hover:border-gray-700 hover:shadow-xl transition-all duration-300 ease-out cursor-pointer flex"
      onClick={() => handleUniversityClick(university)}
      style={{ width: '420px', height: '140px' }}
    >
      <div className="w-[120px] h-[140px] shrink-0 p-2">
        <div className={cn(
          "w-full h-full rounded-lg flex items-center justify-center",
          university.logoColor
        )}>
          <span className="text-white font-bold text-2xl drop-shadow-md">{university.logo}</span>
        </div>
      </div>
      <div className="flex-1 pl-3 pr-4 py-5 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-white text-[18px] leading-tight mb-1.5">
            {university.name}
          </h3>
          <p className="text-[#9CA3AF] text-[15px] mb-2">
            {university.location}
          </p>
          <p className="text-[#B0B7C3] text-[13px] leading-relaxed">
            {university.description}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#000000]">
      <AppSidebar navItems={navItems} activeItem="Universities" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-800/50 bg-[#0a0a0a]">
          <div className="p-6 pb-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back
              </h1>
              <p className="text-gray-400">
                Discover your perfect university match from over 1,000 institutions worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-[#050505] relative">
          {/* Maya Command Bar - Sticky */}
          <div className={cn(
            "sticky top-0 z-40 bg-[#0a0a0a] border-b border-gray-800/50 transition-shadow duration-300",
            isScrolled && "shadow-lg shadow-black/50"
          )}>
            <div className="p-6 pt-8">
              <MayaCommandBar
                context="universities"
                placeholder="Ask about universities, rankings, or programs..."
                onAction={(action) => {
                  if (action.type === 'navigate') {
                    router.push(action.page)
                  }
                }}
              />
            </div>
          </div>
          <div className="p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* For You Section */}
                <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">For You</h2>
                  <p className="text-sm text-gray-500 mt-1">Personalized recommendations based on your profile</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', width: 'max-content' }}>
                  {categories[0].universities.map((university) => (
                    <UniversityCard key={university.id} university={university} />
                  ))}
                </div>
              </div>
            </section>

            {/* Category Sections */}
            {categories.slice(1).map((category) => (
              <section key={category.id} className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.id === 'ivy' && 'Elite institutions with rich history and tradition'}
                      {category.id === 'tech' && 'Leading the innovation in STEM fields'}
                      {category.id === 'public' && 'Excellence in education with affordable tuition'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', width: 'max-content' }}>
                    {category.universities.map((university) => (
                      <UniversityCard key={university.id} university={university} />
                    ))}
                  </div>
                </div>
              </section>
            ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
