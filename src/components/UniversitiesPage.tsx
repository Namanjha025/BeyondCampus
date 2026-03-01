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

  const universities: University[] = [
    {
      id: "1",
      name: "MIT",
      location: "Cambridge, MA",
      specialty: "Engineering & Technology",
      studentCount: "50k students",
      logo: "MIT",
      logoColor: "bg-red-600",
      category: "tech",
      description: "Pioneering innovation in technology and engineering since 1861..."
    },
    {
      id: "2",
      name: "Stanford University",
      location: "Stanford, CA",
      specialty: "Computer Science & Innovation",
      studentCount: "17k students",
      logo: "S",
      logoColor: "bg-red-700",
      category: "tech",
      description: "Where Silicon Valley dreams take shape and innovation thrives..."
    },
    {
      id: "3",
      name: "Harvard University",
      location: "Cambridge, MA",
      specialty: "Liberal Arts & Business",
      studentCount: "23k students",
      logo: "H",
      logoColor: "bg-red-800",
      category: "ivy",
      description: "Cultivating leaders and scholars in America's oldest university..."
    },
    {
      id: "4",
      name: "UC Berkeley",
      location: "Berkeley, CA",
      specialty: "Research & Public Education",
      studentCount: "45k students",
      logo: "B",
      logoColor: "bg-blue-700",
      category: "public",
      description: "Leading public research university driving global progress..."
    },
    {
      id: "5",
      name: "Carnegie Mellon",
      location: "Pittsburgh, PA",
      specialty: "Computer Science & Robotics",
      studentCount: "15k students",
      logo: "CMU",
      logoColor: "bg-gray-700",
      category: "tech",
      description: "Where computer science meets creativity and robots come to life..."
    },
    {
      id: "6",
      name: "Yale University",
      location: "New Haven, CT",
      specialty: "Law & Liberal Arts",
      studentCount: "13k students",
      logo: "Y",
      logoColor: "bg-blue-900",
      category: "ivy",
      description: "Gothic architecture houses centuries of academic excellence..."
    },
    {
      id: "7",
      name: "Princeton University",
      location: "Princeton, NJ",
      specialty: "Mathematics & Sciences",
      studentCount: "8k students",
      logo: "P",
      logoColor: "bg-orange-600",
      category: "ivy",
      description: "Intimate learning environment fostering intellectual curiosity..."
    },
    {
      id: "8",
      name: "Columbia University",
      location: "New York, NY",
      specialty: "Urban Studies & Journalism",
      studentCount: "33k students",
      logo: "C",
      logoColor: "bg-blue-600",
      category: "ivy",
      description: "Manhattan campus where journalism and world affairs converge..."
    }
  ]

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
          </div>
        </div>
      </div>
    </div>
  )
}
