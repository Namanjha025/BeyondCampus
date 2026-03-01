"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, ArrowLeft, GraduationCap, MapPin, Users, Star } from "lucide-react"
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface University {
  id: string
  name: string
  location: string
  logo: string
  logoColor: string
  description: string
  specialties: string[]
  ranking: string
  studentCount: string
  admissionRate: string
  counselorName: string
  counselorTitle: string
  qsRanking: string
}

interface UniversityChatInterfaceProps {
  universityId: string
}

export default function UniversityChatInterface({ universityId }: UniversityChatInterfaceProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [displayedText, setDisplayedText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // University data (in real app, this would come from API/database)
  const universityData: { [key: string]: University } = {
    "1": {
      id: "1",
      name: "MIT",
      location: "Cambridge, MA",
      logo: "MIT",
      logoColor: "bg-red-600",
      description: "Massachusetts Institute of Technology",
      specialties: ["Engineering", "Computer Science", "Physics", "Mathematics"],
      ranking: "#2 National Universities",
      studentCount: "11,934 students",
      admissionRate: "4.1%",
      counselorName: "MIT Admissions",
      counselorTitle: "Admissions Office",
      qsRanking: "#1 QS World Rankings"
    },
    "2": {
      id: "2",
      name: "Stanford University",
      location: "Stanford, CA",
      logo: "S",
      logoColor: "bg-red-700",
      description: "Stanford University",
      specialties: ["Computer Science", "Engineering", "Business", "Medicine"],
      ranking: "#6 National Universities",
      studentCount: "17,249 students",
      admissionRate: "3.9%",
      counselorName: "Stanford Admissions",
      counselorTitle: "Admissions Office",
      qsRanking: "#5 QS World Rankings"
    },
    // Add more universities as needed
  }

  const university = universityData[universityId] || universityData["1"]

  // Welcome message typing effect
  useEffect(() => {
    const welcomeText = `Welcome to ${university.name}`
    
    if (messages.length === 0) {
      setDisplayedText("")
      let currentIndex = 0
      
      const typingInterval = setInterval(() => {
        if (currentIndex < welcomeText.length) {
          setDisplayedText(welcomeText.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typingInterval)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    }
  }, [university.name, messages.length])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputMessage])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage("")

    // Simulate counselor response
    setTimeout(() => {
      const responses = [
        `Great question! At ${university.name}, we're looking for students who are passionate about ${university.specialties[0].toLowerCase()} and innovation. What specific program interests you most?`,
        `I'd be happy to help you with your ${university.name} application! Our ${university.specialties.join(", ").toLowerCase()} programs are among the best in the world. What's your academic background?`,
        `That's a fantastic area of interest! ${university.name} has incredible opportunities in that field. Have you considered our research programs and internship opportunities?`,
        `Excellent! With our ${university.admissionRate} admission rate, we're quite selective, but we look at each application holistically. Tell me more about your achievements and goals.`
      ]

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiResponse])
    }, 1500)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-border/30 bg-background/50 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-secondary/70"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {/* University Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              university.logoColor
            )}>
              <span className="text-white font-bold text-lg">{university.logo}</span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{university.name}</h1>
              <p className="text-sm text-muted-foreground">{university.location}</p>
            </div>

            {/* Apply Button */}
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-medium px-6"
              onClick={() => {
                console.log(`Applying to ${university.name}`)
                alert(`Opening ${university.name} application portal...`)
              }}
            >
              Apply Now
            </Button>
          </div>
        </div>

        {/* University Stats Banner */}
        <div className="bg-secondary/30 border-b border-border/30 px-6 py-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="font-semibold text-foreground">Admission Rate</p>
              <p className="text-muted-foreground">{university.admissionRate}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">QS Ranking</p>
              <p className="text-muted-foreground">{university.qsRanking}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Student Body</p>
              <p className="text-muted-foreground">{university.studentCount}</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        {messages.length === 0 ? (
          /* Welcome State */
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="max-w-2xl w-full text-center -mt-20">
              {/* Counselor Avatar */}
              <div className="mb-6">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {university.counselorName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-3xl font-bold text-foreground">
                  {displayedText}
                </h2>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left flex flex-col items-start"
                  onClick={() => setInputMessage("Tell me about your academic programs")}
                >
                  <GraduationCap className="h-5 w-5 mb-2" />
                  <span className="font-medium">Academic Programs</span>
                  <span className="text-xs text-muted-foreground">Learn about our majors and courses</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left flex flex-col items-start"
                  onClick={() => setInputMessage("What are the admission requirements?")}
                >
                  <Users className="h-5 w-5 mb-2" />
                  <span className="font-medium">Admissions</span>
                  <span className="text-xs text-muted-foreground">Requirements and application process</span>
                </Button>
              </div>

              {/* Input Area */}
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder={`Ask anything about ${university.name}...`}
                  className="min-h-[100px] max-h-[300px] resize-none bg-secondary border-2 border-border/50 rounded-xl text-base leading-relaxed placeholder:text-muted-foreground/70 pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 w-full transition-all duration-200 hover:border-border/70"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  size="icon"
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-lg transition-all duration-200 disabled:opacity-40 hover:scale-105 active:scale-95 hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 opacity-60">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((message, index) => {
                  const prevMessage = index > 0 ? messages[index - 1] : null
                  const showHeader = !prevMessage || prevMessage.role !== message.role || 
                    (message.timestamp.getTime() - prevMessage.timestamp.getTime() > 5 * 60 * 1000) // 5 minutes gap
                  
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "justify-end"
                      )}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-6 w-6 mt-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {university.counselorName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "flex flex-col gap-2 max-w-[80%]",
                          message.role === "user" && "items-end"
                        )}
                      >
                        {/* Message Header */}
                        {showHeader && (
                          <div className={cn(
                            "flex items-center gap-2 text-sm text-[#A0A0A0]",
                            message.role === "user" && "justify-end"
                          )}>
                            <span className="font-semibold tracking-tight">
                              {message.role === "user" ? (session?.user?.name || "User") : university.counselorName}
                            </span>
                          </div>
                        )}
                        {/* Message Bubble */}
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary border border-border"
                          )}
                        >
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
                  )
                })}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 bg-background">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder={`Continue your conversation about ${university.name}...`}
                    className="min-h-[120px] max-h-[300px] resize-none bg-secondary border-2 border-border/50 rounded-xl text-[16px] leading-relaxed placeholder:text-muted-foreground/70 pl-5 pr-16 py-4 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 w-full transition-all duration-200 hover:border-border/70"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    size="icon"
                    className="absolute bottom-3 right-3 h-11 w-11 rounded-lg transition-all duration-200 disabled:opacity-40 hover:scale-105 active:scale-95 hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 opacity-60">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}