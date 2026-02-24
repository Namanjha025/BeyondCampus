"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  GraduationCap, 
  Users, 
  ChevronRight, 
  MoreVertical, 
  User, 
  Settings, 
  LogOut, 
  MapPin,
  Zap,
  Home,
  Compass,
  Brain,
  Sparkles,
  Plus
} from "lucide-react"
import { cn } from '@/lib/utils'

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


export default function ExplorePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

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


  // Categories
  const categories = [
    { id: "mentors", title: "Mentors & Industry Experts", people: people.filter(p => p.category === "mentor") },
    { id: "students", title: "Current Students", people: people.filter(p => p.category === "student") },
    { id: "counselors", title: "Admissions Counselors", people: people.filter(p => p.category === "counselor") },
    { id: "alumni", title: "Alumni Network", people: people.filter(p => p.category === "alumni") },
  ]

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = e.clientX
      if (newWidth >= 200 && newWidth <= 400) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false)
        localStorage.setItem("sidebarWidth", sidebarWidth.toString())
      }
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, sidebarWidth])


  // Handle person click
  const handlePersonClick = (person: Person) => {
    router.push(`/person/${person.id}`)
  }

  // Person card component
  const PersonCard = ({ person }: { person: Person }) => (
    <div 
      className="group relative bg-[#2A2A2A] rounded-xl border border-[#3A3A3A] overflow-hidden hover:scale-[1.015] hover:shadow-2xl hover:border-primary/30 hover:shadow-primary/5 transition-all duration-300 ease-out cursor-pointer flex"
      onClick={() => handlePersonClick(person)}
      style={{ width: '420px', height: '160px' }}
    >
      {/* Left Side - Profile Container */}
      <div className="w-[140px] h-[160px] shrink-0 p-4 bg-secondary/30 relative">
        {/* Avatar */}
        <div className="flex flex-col items-center justify-center h-full">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {person.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Right Side - Text Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Name */}
        <h3 className="font-bold text-white text-[18px] leading-tight mb-1">
          {person.name}
        </h3>
        
        {/* Role & Company */}
        <p className="text-[#9CA3AF] text-[14px] mb-1">
          {person.role} at {person.company}
        </p>
        
        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="h-3 w-3" />
          <span>{person.location}</span>
        </div>
        
        {/* Bio */}
        <p className="text-[#B0B7C3] text-[13px] leading-relaxed line-clamp-2">
          {person.bio}
        </p>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "flex flex-col border-r bg-secondary/50 transition-all duration-300 relative",
          !sidebarOpen && "w-0 overflow-hidden"
        )}
        style={sidebarOpen ? { width: `${sidebarWidth}px` } : {}}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-bold text-lg">BeyondCampus</h2>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Navigation Menu */}
          <nav className="p-4 space-y-2 border-b border-border/30">
            <Button
              variant="ghost"
              className="w-full justify-start text-left hover:bg-accent/50 rounded-md h-10 px-4 transition-all duration-200 group"
              onClick={() => router.push("/")}
            >
              <Home className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[15px] font-medium">Home</span>
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start text-left h-10 px-4 rounded-md"
            >
              <Compass className="h-4 w-4 mr-3 text-primary" />
              <span className="text-[15px] font-medium">Explore People</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left hover:bg-accent/50 rounded-md h-10 px-4 transition-all duration-200 group"
              onClick={() => router.push("/explore/create")}
            >
              <Plus className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[15px] font-medium">Create AI Twin</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left hover:bg-accent/50 rounded-md h-10 px-4 transition-all duration-200 group"
              onClick={() => router.push("/universities")}
            >
              <GraduationCap className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[15px] font-medium">Universities</span>
            </Button>
          </nav>


          <div className="flex-1"></div>
          
          {/* User Account Section */}
          <div className="border-t border-border/50">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground/70">Student</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-secondary/70 opacity-60 hover:opacity-100"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        {sidebarOpen && (
          <div
            className={cn(
              "absolute top-0 -right-1 w-3 h-full cursor-col-resize group",
              isResizing && "bg-primary/10"
            )}
            onMouseDown={handleMouseDown}
          >
            <div className={cn(
              "absolute left-1 top-0 w-1 h-full bg-border group-hover:bg-primary/30 transition-colors",
              isResizing && "bg-primary/50"
            )} />
          </div>
        )}
      </div>

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
                {/* Search Bar */}
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
            {/* Featured Section */}
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

            {/* Category Sections */}
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