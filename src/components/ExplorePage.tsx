"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  GraduationCap,
  ChevronRight,
  MapPin,
  Zap,
  Home,
  Compass,
  Plus
} from "lucide-react"
import { cn } from '@/lib/utils'
import AppSidebar from './AppSidebar'
import type { NavItem } from './AppSidebar'

interface Person {
  id: string
  name: string
  role: string
  company: string
  location: string
  avatar?: string
  category: "mentor" | "student" | "counselor" | "alumni"
  bio: string
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Explore People", icon: Compass, href: "/explore" },
  { label: "Create AI Twin", icon: Plus, href: "/explore/create" },
  { label: "Universities", icon: GraduationCap, href: "/universities" },
]

export default function ExplorePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All")

  // Sample people data
  const people: Person[] = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Product Manager",
      company: "Google",
      location: "Mountain View, CA",
      category: "mentor",
      bio: "Former Stanford CS student, now leading product teams at Google. Love helping students navigate tech careers!"
    },
    {
      id: "2",
      name: "Marcus Johnson",
      role: "Senior Software Engineer",
      company: "Meta",
      location: "Seattle, WA",
      category: "mentor",
      bio: "Full-stack engineer passionate about mentoring. Specialized in system design and career transitions."
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "Graduate Student",
      company: "MIT",
      location: "Cambridge, MA",
      category: "student",
      bio: "PhD candidate in AI/ML. Happy to share insights about graduate school and research opportunities."
    },
    {
      id: "4",
      name: "Dr. Michael Park",
      role: "Admissions Director",
      company: "Stanford University",
      location: "Stanford, CA",
      category: "counselor",
      bio: "15+ years in admissions. Expert in holistic application review and essay guidance."
    },
    {
      id: "5",
      name: "Alex Kumar",
      role: "Data Scientist",
      company: "Netflix",
      location: "Los Angeles, CA",
      category: "alumni",
      bio: "UC Berkeley alum working in entertainment tech. Passionate about data science and analytics careers."
    },
    {
      id: "6",
      name: "Jessica Wu",
      role: "Investment Banking Analyst",
      company: "Goldman Sachs",
      location: "New York, NY",
      category: "mentor",
      bio: "Wharton MBA helping students break into finance. Specialized in investment banking and consulting prep."
    }
  ]

  const categories = [
    { id: "mentors", title: "Mentors & Industry Experts", people: people.filter(p => p.category === "mentor") },
    { id: "students", title: "Current Students", people: people.filter(p => p.category === "student") },
    { id: "counselors", title: "Admissions Counselors", people: people.filter(p => p.category === "counselor") },
    { id: "alumni", title: "Alumni Network", people: people.filter(p => p.category === "alumni") },
  ]

  const handlePersonClick = (person: Person) => {
    router.push(`/person/${person.id}`)
  }

  const PersonCard = ({ person }: { person: Person }) => (
    <div
      className="group relative bg-[#2A2A2A] rounded-xl border border-[#3A3A3A] overflow-hidden hover:scale-[1.015] hover:shadow-2xl hover:border-primary/30 hover:shadow-primary/5 transition-all duration-300 ease-out cursor-pointer flex"
      onClick={() => handlePersonClick(person)}
      style={{ width: '420px', height: '160px' }}
    >
      <div className="w-[140px] h-[160px] shrink-0 p-4 bg-secondary/30 relative">
        <div className="flex flex-col items-center justify-center h-full">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {person.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="font-bold text-white text-[18px] leading-tight mb-1">
          {person.name}
        </h3>
        <p className="text-[#9CA3AF] text-[14px] mb-1">
          {person.role} at {person.company}
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="h-3 w-3" />
          <span>{person.location}</span>
        </div>
        <p className="text-[#B0B7C3] text-[13px] leading-relaxed line-clamp-2">
          {person.bio}
        </p>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar navItems={navItems} activeItem="Explore People" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border/30 bg-background/50 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Explore AI Twins
                </h1>
                <p className="text-muted-foreground">
                  Connect with AI twins of mentors, students, and industry experts
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-[400px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search people, skills, companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 bg-secondary border-border/50 focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              {['All', 'Mentors', 'Students', 'Counselors', 'Alumni'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedFilter === filter
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Featured AI Twins
                </h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="overflow-x-auto scrollbar-hide pb-4">
                <div className="flex gap-4" style={{ width: 'max-content' }}>
                  {people.slice(0, 4).map((person) => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </div>
            </section>

            {categories.map((category) => (
              <section key={category.id} className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">{category.title}</h2>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="overflow-x-auto scrollbar-hide pb-4">
                  <div className="flex gap-4" style={{ width: 'max-content' }}>
                    {category.people.map((person) => (
                      <PersonCard key={person.id} person={person} />
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
