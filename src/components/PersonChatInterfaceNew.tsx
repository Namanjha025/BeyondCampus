"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Send, ArrowLeft, Briefcase, MapPin, MessageCircle, Calendar, BookOpen, Users, Target, Lightbulb, ChevronLeft, ChevronRight, User, Library, ExternalLink } from "lucide-react"
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  links?: { title: string; url: string; }[]
  showButtons?: boolean
}

interface StoryChapter {
  id: string
  episode: number
  title: string
  description: string
  readTime: string
  category: string
  thumbnail?: string
  content: string
}

interface Person {
  id: string
  name: string
  role: string
  company: string
  location: string
  category: "mentor" | "student" | "counselor" | "alumni"
  bio: string
}

interface PersonChatInterfaceProps {
  personId: string
}

interface Service {
  icon: any
  title: string
  duration: string
  price: string
  description: string
}

export default function PersonChatInterface({ personId }: PersonChatInterfaceProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [displayedText, setDisplayedText] = useState("")
  const [servicesSidebarOpen, setServicesSidebarOpen] = useState(false)
  const [myStorySidebarOpen, setMyStorySidebarOpen] = useState(false)
  const [storyModalOpen, setStoryModalOpen] = useState(false)
  const [readingMode, setReadingMode] = useState(false)
  const [currentChapter, setCurrentChapter] = useState<StoryChapter | null>(null)
  const [storyContent, setStoryContent] = useState("")
  const [isReading, setIsReading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Person data
  const personData: { [key: string]: Person } = {
    "1": {
      id: "1",
      name: "Sarah Chen",
      role: "Product Manager",
      company: "Google",
      location: "Mountain View, CA",
      category: "mentor",
      bio: "Former Stanford CS student, now leading product teams at Google. Love helping students navigate tech careers!"
    },
    "2": {
      id: "2",
      name: "Marcus Johnson",
      role: "Senior Software Engineer",
      company: "Meta",
      location: "Seattle, WA",
      category: "mentor",
      bio: "Full-stack engineer passionate about mentoring. Specialized in system design and career transitions."
    }
  }

  const person = personData[personId] || personData["1"]

  // Send first AI message immediately on page load (character.ai style)
  useEffect(() => {
    let welcomeText = ""
    
    switch (personId) {
      case "1":
        welcomeText = "Sarah's probably debugging code while helping you debug your career"
        break
      case "2":
        welcomeText = "Marcus has seen more error messages than you've had hot dinners"
        break
      default:
        welcomeText = `Ready to chat with ${person.name}!`
    }
    
    setDisplayedText(welcomeText)
    
    if (messages.length === 0) {
      setTimeout(() => {
        const firstMessage: Message = {
          id: 'first-message',
          role: 'assistant',
          content: `Hi there! 👋 I'm ${person.name}'s AI twin. I can help you with career advice, share insights from my experience at ${person.company}, and connect you with valuable resources.\n\nWhat would you like to explore today?`,
          timestamp: new Date(),
          links: [
            { title: '💼 Browse My Services', url: '#services' },
            { title: '📚 My Story', url: '#story' },
            { title: '👤 View Full Profile', url: '#profile' }
          ]
        }
        setMessages([firstMessage])
      }, 1000)
    }
  }, [person.name, personId, messages.length, person.company])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Thanks for your question! As a ${person.role} at ${person.company}, I'd be happy to help you with that.`,
        timestamp: new Date(),
        links: [
          { title: '📅 Book a Session', url: '#services' },
          { title: '📚 My Story', url: '#story' }
        ]
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1500)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mentor": return "bg-blue-600"
      case "student": return "bg-green-600"
      case "counselor": return "bg-purple-600"
      case "alumni": return "bg-orange-600"
      default: return "bg-gray-600"
    }
  }

  const getStoryChapters = (): StoryChapter[] => {
    switch (personId) {
      case "1":
        return [
          {
            id: '1',
            episode: 1,
            title: 'The Coding Dreamer: Origins',
            description: 'A young CS student at Stanford discovers her passion isn\'t just in code, but in understanding what people really need from technology.',
            readTime: '8m',
            category: 'Origin Story',
            content: `Growing up in a small town, I was always the kid who took apart electronics just to see how they worked. My parents thought I'd become an engineer, but I had bigger dreams.\n\nWhen I got to Stanford for Computer Science, I thought I'd found my calling. Late nights in Gates Hall, debugging code until 3 AM, surrounded by brilliant minds who spoke in algorithms and data structures. But something was missing.\n\nIt wasn't until my junior year, during a human-computer interaction class, that everything clicked. We were tasked with designing an app for elderly users, and I spent weeks talking to my grandmother about her struggles with technology.\n\nThat's when I realized: the most elegant code in the world means nothing if people can't use it, don't need it, or don't understand it. I wasn't just a coder - I was a bridge between human needs and technological possibilities.\n\nThe transition from pure engineering to product thinking wasn't easy. I had to learn empathy as a skill, user research as a discipline, and strategy as an art. But every frustrating meeting, every failed prototype, every user interview taught me something new about what it means to build products that matter.`
          },
          {
            id: '2',
            episode: 2,
            title: 'The Google Leap: Taking the Plunge',
            description: 'From late-night coding sessions to leading product strategy meetings. The transformation from engineer to product visionary begins.',
            readTime: '12m',
            category: 'Career Transformation',
            content: `The Google interview process was intimidating. Fifteen rounds, whiteboard sessions, and questions that made my CS degree feel inadequate. But when I got the offer, I knew this was my chance to work on products that billions of people use.

My first day was overwhelming. The campus was massive, the projects were complex, and everyone seemed to speak in acronyms I'd never heard. I was assigned to a team working on search algorithms, but my heart was still drawn to the human side of technology.

Six months in, I made a bold move. I pitched a user experience improvement for one of our core products. It was risky - a junior engineer suggesting product changes to senior leadership. But the data was compelling, and more importantly, the user stories were powerful.

That presentation changed everything. Within a year, I transitioned to product management, leading a small team focused on user engagement. We launched three features that year, each one teaching me more about balancing technical feasibility with user needs and business goals.`
          },
          {
            id: '3',
            episode: 3,
            title: 'Failures & Breakthroughs: The Learning Curve',
            description: 'Not every product launch goes as planned. The mistakes that shaped my approach to product management and user empathy.',
            readTime: '10m',
            category: 'Lessons Learned',
            content: `The launch was supposed to be our big breakthrough. Months of development, user testing, and stakeholder alignment. We were confident, maybe too confident.

Within 48 hours, user complaints flooded in. The feature we thought was intuitive was confusing. The workflow we believed was streamlined was actually adding friction. Usage numbers plummeted.

I remember sitting in the post-mortem meeting, watching my carefully crafted slides about success metrics become a lessons-learned presentation about failure. It was humbling and terrifying.

But that failure taught me more than any success ever could. We had focused so much on what we wanted to build that we forgot to validate what users actually needed. We had confused our assumptions with user research.

The rebuild took three months. This time, we involved users at every step. Weekly user interviews, prototype testing, feedback loops that hurt but were necessary. When we relaunched, adoption rates were 3x higher than our original version.`
          },
          {
            id: '4',
            episode: 4,
            title: 'Mentoring the Next Generation',
            description: 'Why I started helping students navigate tech careers and the surprising lessons I learned from being a mentor.',
            readTime: '6m',
            category: 'Giving Back',
            content: `It started with a single email from a Stanford CS student. She was struggling with the same questions I had faced: Should I focus on technical depth or breadth? How do I transition from coding to product strategy? What does a day in product management actually look like?

I spent two hours on a video call with her, sharing my journey and answering her questions. By the end, I realized I had learned as much from her fresh perspective as she had from my experience.

That conversation sparked something in me. I started volunteering at university career fairs, hosting coffee chats with new grads, and eventually creating structured mentorship programs within Google.

What surprised me most was how much mentoring taught me about leadership. Each mentee brought unique challenges that forced me to articulate not just what I do, but why and how I do it. They asked questions I had stopped asking myself.

Today, watching former mentees land their dream jobs, launch successful products, and even start their own mentorship programs is more rewarding than any product launch I've ever led.`
          }
        ]
      case "2":
        return [
          {
            id: '1',
            episode: 1,
            title: 'The Debug Detective: Early Days',
            description: 'Growing up solving puzzles led to a career solving code. How curiosity became my superpower in software engineering.',
            readTime: '7m',
            category: 'Origin Story'
          },
          {
            id: '2',
            episode: 2,
            title: 'The Meta Move: Scaling New Heights',
            description: 'From startup engineer to Big Tech. The culture shock, the learning curve, and why system design became my obsession.',
            readTime: '9m',
            category: 'Career Growth'
          },
          {
            id: '3',
            episode: 3,
            title: 'Breaking Things & Building Better',
            description: 'The production outage that taught me everything about resilience, team dynamics, and why failure is the best teacher.',
            readTime: '11m',
            category: 'War Stories'
          }
        ]
      default:
        return [
          {
            id: '1',
            episode: 1,
            title: 'My Journey Begins',
            description: 'The story of how I got started and what drives my passion for helping others succeed.',
            readTime: '5m',
            category: 'Introduction'
          }
        ]
    }
  }

  const getServices = () => {
    return [
      {
        icon: MessageCircle,
        title: "1-on-1 Career Consultation",
        duration: "45 min",
        price: "$75",
        description: "Personal career guidance and roadmap planning"
      },
      {
        icon: Target,
        title: "Resume Review & Optimization",
        duration: "30 min",
        price: "$50",
        description: "Expert feedback on your resume with actionable improvements"
      }
    ]
  }


  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <div className={cn("flex flex-col transition-all duration-300", readingMode ? "w-1/2" : "flex-1")}>
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-800 bg-black/50 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-white/10 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={cn(
                "text-white font-bold text-sm",
                getCategoryColor(person.category)
              )}>
                {person.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">{person.name}</h1>
              <div className="text-sm text-gray-400">
                By @{person.company.toLowerCase().replace(' ', '')}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/person-profile/${personId}`)}
                className="font-medium border-gray-600 text-white hover:bg-white/10"
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setServicesSidebarOpen(!servicesSidebarOpen)}
                className="font-medium border-gray-600 text-white hover:bg-white/10"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Services
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStoryModalOpen(true)}
                className="font-medium border-gray-600 text-white hover:bg-white/10"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                My Story
              </Button>
            </div>
          </div>
        </div>

        {/* Compact Profile Header */}
        <div className="bg-[#0a0a0a] border-b border-gray-800 p-6">
          <div className="max-w-4xl mx-auto text-center">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarFallback className={cn(
                "text-white text-2xl font-bold",
                getCategoryColor(person.category)
              )}>
                {person.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              {person.name}
            </h1>
            
            <h2 className="text-lg text-gray-300 mb-2">
              {displayedText}
            </h2>
            
            <p className="text-gray-400 text-sm">
              By @{person.company.toLowerCase().replace(' ', '')}
            </p>
          </div>
        </div>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 bg-[#0a0a0a]" ref={scrollAreaRef}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "justify-end"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-6 w-6 mt-6">
                    <AvatarFallback className={cn(
                      "text-white text-xs",
                      getCategoryColor(person.category)
                    )}>
                      {person.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "flex flex-col gap-2 max-w-[80%]",
                    message.role === "user" && "items-end"
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-2 text-sm text-[#A0A0A0]",
                    message.role === "user" && "justify-end"
                  )}>
                    <span className="font-semibold tracking-tight">
                      {message.role === "user" 
                        ? "namanjha_25" 
                        : person.name}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary border border-border"
                    )}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    
                    {message.links && message.role === "assistant" && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {message.links.map((link, idx) => {
                          const handleButtonClick = () => {
                            if (link.url === '#services') {
                              setServicesSidebarOpen(true)
                            } else if (link.url === '#story') {
                              setStoryModalOpen(true)
                            } else if (link.url === '#profile') {
                              router.push(`/person-profile/${personId}`)
                            }
                          }
                          
                          return (
                            <button
                              key={idx}
                              onClick={handleButtonClick}
                              className="bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
                            >
                              {link.title}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground opacity-60">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-6 w-6 mt-6">
                    <AvatarFallback className="text-xs">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-6 bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-[#404040] rounded-[32px] px-6 py-4 min-h-[80px]">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder={`Message ${person.name}...`}
                className="w-full bg-transparent border-none outline-none text-white text-[18px] placeholder:text-[#A0A0A0] pr-[160px] py-2"
              />
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <button 
                  onClick={() => setServicesSidebarOpen(!servicesSidebarOpen)}
                  className="w-11 h-11 bg-[#555555] rounded-[20px] flex items-center justify-center hover:bg-[#666666] transition-colors"
                  title="Services"
                >
                  <Briefcase className="h-5 w-5 text-white" />
                </button>
                
                <button 
                  onClick={() => setStoryModalOpen(true)}
                  className="w-11 h-11 bg-[#555555] rounded-[20px] flex items-center justify-center hover:bg-[#666666] transition-colors"
                  title="My Story"
                >
                  <BookOpen className="h-5 w-5 text-white" />
                </button>
                
                {inputMessage.trim() && (
                  <button 
                    onClick={handleSendMessage}
                    className="w-11 h-11 bg-[#555555] rounded-[20px] flex items-center justify-center hover:bg-[#666666] transition-colors"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              This is A.I. and not a real person. Treat everything it says as fiction
            </p>
          </div>
        </div>
      </div>

      {/* Services Sidebar */}
      {servicesSidebarOpen && (
        <div className="w-80 border-l border-gray-800 bg-gray-900/50 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-white">Available Services</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setServicesSidebarOpen(false)}
              className="h-8 w-8 p-0 text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {getServices().map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <service.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm mb-1">{service.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <span>{service.duration}</span>
                        <span>•</span>
                        <span className="font-semibold text-green-400">{service.price}</span>
                      </div>
                      <p className="text-xs text-gray-400">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {storyModalOpen && !readingMode && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="border-b border-gray-800 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{person.name}'s Story</h2>
                <p className="text-gray-400">Journey through my experiences, lessons, and insights</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStoryModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            {/* Story Overview */}
            <div className="p-6 border-b border-gray-800 bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📖</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Ready to begin?</h3>
                    <p className="text-gray-400">{getStoryChapters().length} chapters • Complete journey</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    const firstChapter = getStoryChapters()[0]
                    setStoryModalOpen(false)
                    
                    // Add initial excitement message
                    setTimeout(() => {
                      const timestamp = Date.now()
                      const initialMessage: Message = {
                        id: `chapter-selection-${timestamp}`,
                        role: 'assistant',
                        content: `I see you want to start reading from the beginning! 📚✨\n\n**${firstChapter.title}** - ${firstChapter.description}\n\nThis is going to be exciting! Let me get everything ready for you...`,
                        timestamp: new Date()
                      }
                      setMessages(prev => [...prev, initialMessage])

                      // Then activate reading mode
                      setTimeout(() => {
                        const readingMessage: Message = {
                          id: `reading-activation-${timestamp + 1}`,
                          role: 'assistant',
                          content: `🚀 **Going into Reading Mode...**\n\nI'll stay here on the left so you can ask questions anytime while I share my story with you on the right!`,
                          timestamp: new Date()
                        }
                        setMessages(prev => [...prev, readingMessage])
                        setCurrentChapter(firstChapter)
                        setReadingMode(true)
                      }, 2000)
                    }, 500)
                  }}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3"
                >
                  ▶️ Play All
                </Button>
              </div>
            </div>

            {/* Chapters Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {getStoryChapters().map((chapter) => (
                  <div
                    key={chapter.id}
                    className="group bg-gray-800 rounded-lg hover:bg-gray-700 transition-all cursor-pointer border border-gray-600 hover:border-primary/50"
                    onClick={() => {
                      setStoryModalOpen(false)
                      
                      // Add initial excitement message about the specific chapter
                      setTimeout(() => {
                        const timestamp = Date.now()
                        const initialMessage: Message = {
                          id: `chapter-${chapter.id}-selection-${timestamp}`,
                          role: 'assistant',
                          content: `I see you want to read Chapter ${chapter.episode}! 📖✨\n\n**${chapter.title}** - ${chapter.description}\n\nOh, this is one of my favorites! Let me get the reading experience ready for you...`,
                          timestamp: new Date()
                        }
                        setMessages(prev => [...prev, initialMessage])

                        // Then activate reading mode
                        setTimeout(() => {
                          const readingMessage: Message = {
                            id: `reading-${chapter.id}-${timestamp + 1}`,
                            role: 'assistant',
                            content: `🚀 **Going into Reading Mode...**\n\nI'll stay here on the left so you can pause and ask questions anytime while I share this chapter with you!`,
                            timestamp: new Date()
                          }
                          setMessages(prev => [...prev, readingMessage])
                          setCurrentChapter(chapter)
                          setReadingMode(true)
                        }, 2000)
                      }, 500)
                    }}
                  >
                    <div className="flex gap-6 p-5">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/50 transition-colors shadow-lg">
                          <span className="text-primary font-bold text-2xl">{chapter.episode}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-white font-bold text-xl leading-tight group-hover:text-primary transition-colors pr-4">
                            {chapter.title}
                          </h3>
                          <span className="text-gray-400 text-sm flex-shrink-0 bg-gray-700/50 px-3 py-1 rounded-full">{chapter.readTime}</span>
                        </div>
                        <p className="text-gray-300 text-base leading-relaxed mb-4">
                          {chapter.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="px-4 py-2 bg-primary/15 text-primary text-sm rounded-full border border-primary/30 font-medium">
                            {chapter.category}
                          </span>
                          <div className="text-gray-500 text-sm">
                            Episode {chapter.episode}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reading Mode Artifact */}
      {readingMode && currentChapter && (
        <div className="w-1/2 bg-black border-l border-gray-700 flex flex-col shadow-2xl">
          {/* Story Header */}
          <div className="p-6 border-b border-gray-800 bg-black">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-white mb-2">{currentChapter.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Chapter {currentChapter.episode}</span>
                  <span>•</span>
                  <span>{currentChapter.readTime}</span>
                  <span>•</span>
                  <span>{currentChapter.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (isReading) {
                      setIsReading(false)
                    } else {
                      setIsReading(true)
                      // Start streaming the story content
                      setStoryContent("")
                      let index = 0
                      const content = currentChapter.content
                      const timer = setInterval(() => {
                        setStoryContent(content.slice(0, index))
                        index += 2
                        if (index >= content.length) {
                          clearInterval(timer)
                          setIsReading(false)
                        }
                      }, 50)
                    }
                  }}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  {isReading ? "⏸️ Pause" : "▶️ Play"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  🔊 Listen
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReadingMode(false)
                    setCurrentChapter(null)
                    setStoryContent("")
                    setIsReading(false)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-black">
            <div className="max-w-none">
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {storyContent || currentChapter.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}