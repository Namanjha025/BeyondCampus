"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  User,
  Link as LinkIcon,
  Trophy,
  Briefcase,
  GraduationCap,
  Heart,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  Globe,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  Award,
  Code,
  Star
} from "lucide-react"
import { cn } from '@/lib/utils'

interface ProfileData {
  personal: {
    name: string
    bio: string
    location: string
    email: string
    phone: string
  }
  links: Array<{
    id: string
    title: string
    url: string
    type: 'portfolio' | 'linkedin' | 'github' | 'website' | 'other'
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    date: string
    category: 'award' | 'certification' | 'milestone' | 'recognition'
  }>
  experience: Array<{
    id: string
    title: string
    company: string
    description: string
    startDate: string
    endDate: string
    current: boolean
  }>
  skills: Array<{
    id: string
    name: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    category: 'technical' | 'soft'
  }>
  education: Array<{
    id: string
    degree: string
    institution: string
    year: string
    description?: string
  }>
  interests: string[]
}

export default function PortfolioPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [editingItem, setEditingItem] = useState<string | null>(null)

  // Mock data - would come from API/database
  const [profileData, setProfileData] = useState<ProfileData>({
    personal: {
      name: "John Doe",
      bio: "Passionate software engineer with 5+ years of experience in full-stack development and AI/ML systems.",
      location: "San Francisco, CA",
      email: "john@example.com",
      phone: "+1 (555) 123-4567"
    },
    links: [
      {
        id: "1",
        title: "Portfolio Website",
        url: "https://johndoe.dev",
        type: "portfolio"
      },
      {
        id: "2",
        title: "LinkedIn Profile",
        url: "https://linkedin.com/in/johndoe",
        type: "linkedin"
      },
      {
        id: "3",
        title: "GitHub",
        url: "https://github.com/johndoe",
        type: "github"
      }
    ],
    achievements: [
      {
        id: "1",
        title: "Best Innovation Award",
        description: "Recognized for developing an AI-powered code review system that improved team productivity by 40%",
        date: "2024-03-15",
        category: "award"
      },
      {
        id: "2",
        title: "AWS Solutions Architect Certification",
        description: "Achieved professional-level certification in AWS cloud architecture",
        date: "2023-11-20",
        category: "certification"
      }
    ],
    experience: [
      {
        id: "1",
        title: "Senior Software Engineer",
        company: "Tech Corp",
        description: "Lead full-stack development team, architected microservices infrastructure",
        startDate: "2022-01",
        endDate: "",
        current: true
      },
      {
        id: "2",
        title: "Software Developer",
        company: "StartupXYZ",
        description: "Built MVP from scratch, implemented CI/CD pipelines",
        startDate: "2020-06",
        endDate: "2021-12",
        current: false
      }
    ],
    skills: [
      { id: "1", name: "React", level: "expert", category: "technical" },
      { id: "2", name: "Node.js", level: "advanced", category: "technical" },
      { id: "3", name: "Python", level: "advanced", category: "technical" },
      { id: "4", name: "Leadership", level: "intermediate", category: "soft" },
      { id: "5", name: "Communication", level: "advanced", category: "soft" }
    ],
    education: [
      {
        id: "1",
        degree: "M.S. Computer Science",
        institution: "Stanford University",
        year: "2020",
        description: "Specialization in Artificial Intelligence and Machine Learning"
      },
      {
        id: "2",
        degree: "B.S. Computer Engineering",
        institution: "UC Berkeley",
        year: "2018"
      }
    ],
    interests: ["Machine Learning", "Open Source", "Photography", "Hiking", "Cooking"]
  })

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'portfolio':
      case 'website':
        return <Globe className="h-4 w-4" />
      case 'github':
        return <Github className="h-4 w-4" />
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />
      default:
        return <LinkIcon className="h-4 w-4" />
    }
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'advanced':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      case 'beginner':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <div className="border-b border-[hsl(0_0%_18%)] bg-[hsl(0_0%_4%)]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-secondary/70"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Your Portfolio</h1>
                  <p className="text-sm text-muted-foreground">Manage your personal information and achievements</p>
                </div>
              </div>
            </div>

            <Button className="bg-primary hover:bg-primary/90 text-black">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)]">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <Input
                    value={profileData.personal.name}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personal: { ...profileData.personal, name: e.target.value }
                    })}
                    className="bg-[#0d1117] border-[hsl(0_0%_18%)] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <Input
                    type="email"
                    value={profileData.personal.email}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personal: { ...profileData.personal, email: e.target.value }
                    })}
                    className="bg-[#0d1117] border-[hsl(0_0%_18%)] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Location</label>
                  <Input
                    value={profileData.personal.location}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personal: { ...profileData.personal, location: e.target.value }
                    })}
                    className="bg-[#0d1117] border-[hsl(0_0%_18%)] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone</label>
                  <Input
                    type="tel"
                    value={profileData.personal.phone}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personal: { ...profileData.personal, phone: e.target.value }
                    })}
                    className="bg-[#0d1117] border-[hsl(0_0%_18%)] text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">Bio</label>
                  <Textarea
                    value={profileData.personal.bio}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personal: { ...profileData.personal, bio: e.target.value }
                    })}
                    rows={4}
                    className="bg-[#0d1117] border-[hsl(0_0%_18%)] text-white resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links">
            <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Links & Social Media</h2>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
              
              <div className="space-y-4">
                {profileData.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-[hsl(0_0%_6%)] border border-[hsl(0_0%_18%)] rounded-lg group hover:border-[hsl(0_0%_24%)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getLinkIcon(link.type)}
                      <div>
                        <h3 className="text-sm font-medium text-white">{link.title}</h3>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {link.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Achievements & Awards</h2>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
              
              <div className="space-y-4">
                {profileData.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 bg-[hsl(0_0%_6%)] border border-[hsl(0_0%_18%)] rounded-lg group hover:border-[hsl(0_0%_24%)] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                          <Trophy className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-white">{achievement.title}</h3>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {achievement.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Skills & Expertise</h2>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Technical Skills
                  </h3>
                  <div className="space-y-2">
                    {profileData.skills.filter(skill => skill.category === 'technical').map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-3 bg-[hsl(0_0%_6%)] border border-[hsl(0_0%_18%)] rounded-lg group hover:border-[hsl(0_0%_24%)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-white">{skill.name}</span>
                          <Badge className={cn("text-xs border", getSkillLevelColor(skill.level))}>
                            {skill.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Soft Skills
                  </h3>
                  <div className="space-y-2">
                    {profileData.skills.filter(skill => skill.category === 'soft').map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-3 bg-[hsl(0_0%_6%)] border border-[hsl(0_0%_18%)] rounded-lg group hover:border-[hsl(0_0%_24%)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-white">{skill.name}</span>
                          <Badge className={cn("text-xs border", getSkillLevelColor(skill.level))}>
                            {skill.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Placeholder tabs */}
          <TabsContent value="experience">
            <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Work Experience</h2>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <p className="text-muted-foreground">Experience management coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Education</h2>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
              <p className="text-muted-foreground">Education management coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="interests">
            <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Interests & Hobbies</h2>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Interest
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 cursor-pointer"
                  >
                    {interest}
                    <button className="ml-2 hover:text-red-400">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}