'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Send,
  ArrowLeft,
  Briefcase,
  MapPin,
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  Target,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  User,
  Library,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  links?: { title: string; url: string }[];
  showButtons?: boolean;
}

interface KnowledgeChapter {
  id: string;
  title: string;
  description: string;
  tags: string[];
  readTime: string;
  category: string;
}

interface Person {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  category: 'mentor' | 'student' | 'counselor' | 'alumni';
  bio: string;
}

interface PersonChatInterfaceProps {
  personId: string;
}

interface Service {
  icon: any;
  title: string;
  duration: string;
  price: string;
  description: string;
}

interface ServiceSquareProps {
  services: Service[];
}

const ServiceSquare = ({ services }: ServiceSquareProps) => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (services.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 4000); // Slower rotation - 4 seconds

    return () => clearInterval(interval);
  }, [services.length, isPaused]);

  if (services.length === 0) return null;

  const currentService = services[currentServiceIndex];

  return (
    <div className="relative w-64">
      {/* Collapsed View - Single Square */}
      {!isExpanded && (
        <div
          className="w-64 h-64 bg-secondary/50 rounded-xl border border-border/30 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Service Content */}
          <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            {/* Icon */}
            <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-3">
              <currentService.icon className="h-6 w-6 text-primary" />
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground text-base mb-2 leading-tight line-clamp-2 w-full">
              {currentService.title}
            </h3>

            {/* Duration & Price */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 flex-shrink-0">
              <span className="whitespace-nowrap">
                {currentService.duration}
              </span>
              <span>•</span>
              <span className="font-semibold text-primary whitespace-nowrap">
                {currentService.price}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 w-full">
              {currentService.description}
            </p>

            {/* View All Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="mt-3 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View all services ({services.length})
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentServiceIndex(
                (prev) => (prev - 1 + services.length) % services.length
              );
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentServiceIndex((prev) => (prev + 1) % services.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentServiceIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentServiceIndex
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Expanded View - All Services */}
      {isExpanded && (
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Available Services
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Collapse
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-secondary/50 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group"
                onClick={() => {
                  console.log(`Booking service: ${service.title}`);
                  alert(
                    `Opening booking for: ${service.title} (${service.duration} - ${service.price})`
                  );
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm mb-1">
                      {service.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span>{service.duration}</span>
                      <span>•</span>
                      <span className="font-semibold text-primary">
                        {service.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function PersonChatInterface({
  personId,
}: PersonChatInterfaceProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [servicesSidebarOpen, setServicesSidebarOpen] = useState(true);
  const [knowledgeBaseSidebarOpen, setKnowledgeBaseSidebarOpen] =
    useState(false);
  const textareaRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Person data (in real app, this would come from API/database)
  const personData: { [key: string]: Person } = {
    '1': {
      id: '1',
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'Google',
      location: 'Mountain View, CA',
      category: 'mentor',
      bio: 'Former Stanford CS student, now leading product teams at Google. Love helping students navigate tech careers!',
    },
    '2': {
      id: '2',
      name: 'Marcus Johnson',
      role: 'Senior Software Engineer',
      company: 'Meta',
      location: 'Seattle, WA',
      category: 'mentor',
      bio: 'Full-stack engineer passionate about mentoring. Specialized in system design and career transitions.',
    },
    '3': {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Graduate Student',
      company: 'MIT',
      location: 'Cambridge, MA',
      category: 'student',
      bio: 'PhD candidate in AI/ML. Happy to share insights about graduate school and research opportunities.',
    },
    '4': {
      id: '4',
      name: 'Dr. Michael Park',
      role: 'Admissions Director',
      company: 'Stanford University',
      location: 'Stanford, CA',
      category: 'counselor',
      bio: '15+ years in admissions. Expert in holistic application review and essay guidance.',
    },
    '5': {
      id: '5',
      name: 'Alex Kumar',
      role: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Angeles, CA',
      category: 'alumni',
      bio: 'UC Berkeley alum working in entertainment tech. Passionate about data science and analytics careers.',
    },
    '6': {
      id: '6',
      name: 'Jessica Wu',
      role: 'Investment Banking Analyst',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      category: 'mentor',
      bio: 'Wharton MBA helping students break into finance. Specialized in investment banking and consulting prep.',
    },
  };

  const person = personData[personId] || personData['1'];

  // Welcome message typing effect
  useEffect(() => {
    let welcomeText = '';

    // Funny personalized greetings for each person
    switch (personId) {
      case '1': // Sarah Chen
        welcomeText =
          "Sarah's probably debugging code while helping you debug your career";
        break;
      case '2': // Marcus Johnson
        welcomeText =
          "Marcus has seen more error messages than you've had hot dinners";
        break;
      case '3': // Emily Rodriguez
        welcomeText =
          "Emily's PhD research: 'Can AI explain why grad students survive on coffee?'";
        break;
      case '4': // Dr. Michael Park
        welcomeText = 'Dr. Park has read more essays than Netflix has shows';
        break;
      case '5': // Alex Kumar
        welcomeText =
          'Alex turned data into Netflix recommendations and career advice into gold';
        break;
      case '6': // Jessica Wu
        welcomeText = 'Jessica: Making spreadsheets sexy since her MBA days';
        break;
      default:
        welcomeText = `Ready to chat with ${person.name}!`;
    }

    if (messages.length === 0) {
      setDisplayedText('');
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < welcomeText.length) {
          setDisplayedText(welcomeText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);

          // Add the AI's first message with call-to-action buttons after typing completes
          setTimeout(() => {
            const firstMessage: Message = {
              id: 'first-message',
              role: 'assistant',
              content: `Hi there! 👋 I'm ${person.name}'s AI twin. I can help you with career advice, share insights from my experience at ${person.company}, and connect you with valuable resources.\n\nWhat would you like to explore today?`,
              timestamp: new Date(),
              links: [
                { title: '💼 Browse My Services', url: '#services' },
                { title: '📚 Explore Knowledge Base', url: '#knowledge' },
                { title: '👤 View Full Profile', url: '#profile' },
              ],
            };
            setMessages([firstMessage]);
          }, 1500);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [person.name, personId, messages.length, person.company]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Simulate person response based on category
    setTimeout(() => {
      let responses: string[] = [];

      switch (person.category) {
        case 'mentor':
          responses = [
            `Great question! As a ${person.role} at ${person.company}, I'd say the most important thing is to focus on building strong fundamentals. What specific area would you like guidance on?`,
            `I love your enthusiasm! In my experience, I've seen that success comes from continuous learning and networking. Tell me more about your goals.`,
            `That's a smart question to ask. At ${person.company}, we look for people who are not just technically skilled but also great collaborators. What's your background?`,
            `Excellent! I remember asking similar questions when I was starting out. The key is to be strategic about your career moves. What stage are you at currently?`,
          ];
          break;
        case 'student':
          responses = [
            `Hey there! As a fellow student, I totally understand what you're going through. I'm currently working on research at ${person.company}. What's your academic focus?`,
            `That's such a relevant question! I faced similar challenges during my studies. The key is to balance coursework with practical experience. What year are you in?`,
            `Great to connect with you! Being at ${person.company} has taught me so much about research and academics. What specific challenges are you facing?`,
            `I can definitely relate to that! Graduate school has its ups and downs, but it's incredibly rewarding. What field are you interested in pursuing?`,
          ];
          break;
        case 'counselor':
          responses = [
            `Thank you for reaching out! In my years of experience, I've helped thousands of students navigate their applications. What specific aspect of admissions can I help you with?`,
            `That's a very important question! In holistic admissions, we look at much more than just grades and test scores. Tell me about your interests and experiences.`,
            `Excellent question! I always tell students that authenticity is key in applications. What makes you unique and passionate about your chosen field?`,
            `I'm glad you asked! The admissions process can seem overwhelming, but breaking it down into manageable steps helps. What's your timeline looking like?`,
          ];
          break;
        case 'alumni':
          responses = [
            `Hello! As an alum now working at ${person.company}, I'm excited to help. The transition from college to industry taught me a lot. What questions do you have?`,
            `Great to meet you! My journey from university to ${person.role} has been quite an adventure. I'd love to share insights about my field. What interests you most?`,
            `Thanks for connecting! Looking back on my college experience and career path, there are definitely things I wish I knew earlier. What stage are you at in your journey?`,
            `Hey there! The alumni network has been incredible for my career growth. I'm always happy to pay it forward and help fellow students. What can I assist you with?`,
          ];
          break;
        default:
          responses = [
            `Thanks for reaching out! I'd be happy to help answer your questions based on my experience. What would you like to know?`,
          ];
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        links: [
          { title: '📅 Book a Session', url: '#services' },
          { title: '📚 Explore Knowledge', url: '#knowledge' },
        ],
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const getKnowledgeChapters = (): KnowledgeChapter[] => {
    switch (personId) {
      case '1': // Sarah Chen
        return [
          {
            id: '1',
            title: 'Breaking Into Product Management',
            description:
              'My journey from CS to leading product teams at Google',
            tags: ['Career', 'Product Management', 'Tech'],
            readTime: '8 min read',
            category: 'Career Journey',
          },
          {
            id: '2',
            title: 'Mastering Product Strategy',
            description: 'Framework I use for strategic product decisions',
            tags: ['Strategy', 'Framework', 'Product'],
            readTime: '12 min read',
            category: 'Frameworks',
          },
          {
            id: '3',
            title: 'User Research Best Practices',
            description:
              'How to conduct research that actually impacts product decisions',
            tags: ['Research', 'UX', 'Data'],
            readTime: '6 min read',
            category: 'Research',
          },
          {
            id: '4',
            title: 'Working with Engineering Teams',
            description:
              'Building strong relationships between PM and engineering',
            tags: ['Collaboration', 'Engineering', 'Leadership'],
            readTime: '10 min read',
            category: 'Leadership',
          },
        ];
        break;
      case '2': // Marcus Johnson
        return [
          {
            id: '1',
            title: 'System Design Fundamentals',
            description:
              'Core principles I use when designing scalable systems',
            tags: ['System Design', 'Architecture', 'Scalability'],
            readTime: '15 min read',
            category: 'Technical',
          },
          {
            id: '2',
            title: 'Career Transition to Tech',
            description: 'How I switched from finance to software engineering',
            tags: ['Career Change', 'Learning', 'Motivation'],
            readTime: '10 min read',
            category: 'Career Journey',
          },
        ];
        break;
      default:
        return [
          {
            id: '1',
            title: 'Getting Started',
            description: 'Introduction to my experience and expertise',
            tags: ['Introduction', 'Overview'],
            readTime: '5 min read',
            category: 'General',
          },
        ];
    }
  };

  const getServices = () => {
    switch (person.category) {
      case 'mentor':
        return [
          {
            icon: MessageCircle,
            title: '1-on-1 Career Consultation',
            duration: '45 min',
            price: '$75',
            description: 'Personal career guidance and roadmap planning',
          },
          {
            icon: Target,
            title: 'Resume Review & Optimization',
            duration: '30 min',
            price: '$50',
            description:
              'Expert feedback on your resume with actionable improvements',
          },
          {
            icon: Lightbulb,
            title: 'Mock Interview Session',
            duration: '60 min',
            price: '$100',
            description: 'Practice interviews with real-time feedback',
          },
          {
            icon: Briefcase,
            title: 'Career Transition Strategy',
            duration: '60 min',
            price: '$120',
            description: 'Strategic planning for career pivots and transitions',
          },
          {
            icon: Users,
            title: 'LinkedIn Profile Makeover',
            duration: '30 min',
            price: '$45',
            description: 'Optimize your LinkedIn for maximum visibility',
          },
        ];
      case 'student':
        return [
          {
            icon: BookOpen,
            title: 'Study Buddy Session',
            duration: '60 min',
            price: '$30',
            description: 'Collaborative study session for challenging topics',
          },
          {
            icon: Users,
            title: 'Campus Life Q&A',
            duration: '30 min',
            price: '$20',
            description: 'Get insider tips about student life and activities',
          },
          {
            icon: Target,
            title: 'Research Opportunities Guide',
            duration: '45 min',
            price: '$40',
            description: 'Learn how to find and secure research positions',
          },
          {
            icon: MessageCircle,
            title: 'Academic Planning Session',
            duration: '45 min',
            price: '$35',
            description: 'Plan your courses and academic trajectory',
          },
        ];
      case 'counselor':
        return [
          {
            icon: BookOpen,
            title: 'Application Strategy Session',
            duration: '60 min',
            price: '$150',
            description: 'Comprehensive college application planning',
          },
          {
            icon: MessageCircle,
            title: 'Essay Brainstorming Workshop',
            duration: '45 min',
            price: '$100',
            description: 'Develop compelling essay topics and outlines',
          },
          {
            icon: Target,
            title: 'School List Building',
            duration: '60 min',
            price: '$120',
            description:
              'Create a balanced list of reach, match, and safety schools',
          },
          {
            icon: Users,
            title: 'Interview Preparation',
            duration: '45 min',
            price: '$90',
            description: 'Practice for college admissions interviews',
          },
          {
            icon: Lightbulb,
            title: 'Financial Aid Consultation',
            duration: '30 min',
            price: '$60',
            description: 'Navigate scholarships and financial aid options',
          },
        ];
      case 'alumni':
        return [
          {
            icon: Briefcase,
            title: 'Industry Transition Roadmap',
            duration: '60 min',
            price: '$85',
            description: 'Navigate from campus to corporate successfully',
          },
          {
            icon: Users,
            title: 'Networking Masterclass',
            duration: '45 min',
            price: '$65',
            description: 'Build meaningful professional connections',
          },
          {
            icon: Target,
            title: 'First Job Strategy',
            duration: '45 min',
            price: '$70',
            description: 'Land your first job after graduation',
          },
          {
            icon: MessageCircle,
            title: 'Alumni Mentorship Hour',
            duration: '60 min',
            price: '$80',
            description: 'Ongoing mentorship and career guidance',
          },
        ];
      default:
        return [];
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mentor':
        return 'bg-blue-600';
      case 'student':
        return 'bg-green-600';
      case 'counselor':
        return 'bg-purple-600';
      case 'alumni':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Simplified Character.ai Style */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-800 bg-black/50 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-white/10 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Person Info - Simplified */}
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback
                className={cn(
                  'text-white font-bold text-sm',
                  getCategoryColor(person.category)
                )}
              >
                {person.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">{person.name}</h1>
              <div className="text-sm text-gray-400">
                By @{person.company.toLowerCase().replace(' ', '')}
              </div>
            </div>

            {/* Action Buttons - Right side */}
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
                onClick={() =>
                  setKnowledgeBaseSidebarOpen(!knowledgeBaseSidebarOpen)
                }
                className="font-medium border-gray-600 text-white hover:bg-white/10"
              >
                <Library className="h-4 w-4 mr-2" />
                Knowledge Base
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages - Always show, no welcome screen */}
        <>
          {/* Compact Profile Header - Character.ai Style */}
          <div className="bg-[#0a0a0a] border-b border-gray-800 p-6">
            <div className="max-w-4xl mx-auto text-center">
              {/* Avatar */}
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback
                  className={cn(
                    'text-white text-2xl font-bold',
                    getCategoryColor(person.category)
                  )}
                >
                  {person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              {/* Name */}
              <h1 className="text-2xl font-bold text-white mb-2">
                {person.name}
              </h1>

              {/* Tagline */}
              <h2 className="text-lg text-gray-300 mb-2">{displayedText}</h2>

              {/* Bio */}
              <p className="text-gray-400 text-sm">
                By @{person.company.toLowerCase().replace(' ', '')}
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4 bg-[#0a0a0a]" ref={scrollAreaRef}>
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message, index) => {
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showHeader =
                  !prevMessage ||
                  prevMessage.role !== message.role ||
                  message.timestamp.getTime() -
                    prevMessage.timestamp.getTime() >
                    5 * 60 * 1000; // 5 minutes gap

                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' && 'justify-end'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-6 w-6 mt-6">
                        <AvatarFallback
                          className={cn(
                            'text-white text-xs',
                            getCategoryColor(person.category)
                          )}
                        >
                          {person.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'flex flex-col gap-2 max-w-[80%]',
                        message.role === 'user' && 'items-end'
                      )}
                    >
                      {/* Message Header */}
                      {showHeader && (
                        <div
                          className={cn(
                            'flex items-center gap-2 text-sm text-[#A0A0A0]',
                            message.role === 'user' && 'justify-end'
                          )}
                        >
                          <span className="font-semibold tracking-tight">
                            {message.role === 'user'
                              ? session?.user?.name || 'User'
                              : person.name}
                          </span>
                        </div>
                      )}
                      {/* Message Bubble */}
                      <div
                        className={cn(
                          'rounded-lg px-4 py-2',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary border border-border'
                        )}
                      >
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {/* Call-to-Action Buttons */}
                        {message.links && message.role === 'assistant' && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {message.links.map((link, idx) => {
                              const handleButtonClick = () => {
                                if (link.url === '#services') {
                                  setServicesSidebarOpen(true);
                                } else if (link.url === '#knowledge') {
                                  setKnowledgeBaseSidebarOpen(true);
                                } else if (link.url === '#profile') {
                                  router.push(`/person-profile/${personId}`);
                                }
                              };

                              return (
                                <button
                                  key={idx}
                                  onClick={handleButtonClick}
                                  className="bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
                                >
                                  {link.title}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground opacity-60">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-6 w-6 mt-6">
                        <AvatarFallback className="text-xs">You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Input Area - Fixed at Bottom */}
          <div className="p-6 bg-[#0a0a0a]">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-[#404040] rounded-[32px] px-6 py-4 pr-[200px] min-h-[80px]">
                <input
                  ref={textareaRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Message ${person.name}...`}
                  className="absolute top-6 left-6 right-[220px] bg-transparent border-none outline-none text-white text-[18px] placeholder:text-[#A0A0A0]"
                />

                {/* Bottom-right Button Container */}
                <div className="absolute right-4 bottom-4 flex items-center gap-3">
                  {/* Services Button */}
                  <button
                    onClick={() => setServicesSidebarOpen(!servicesSidebarOpen)}
                    className="w-11 h-11 bg-[#555555] rounded-[20px] flex items-center justify-center hover:bg-[#666666] transition-colors"
                    title="Services"
                  >
                    <Briefcase className="h-5 w-5 text-white" />
                  </button>

                  {/* Knowledge Base Button */}
                  <button
                    onClick={() =>
                      setKnowledgeBaseSidebarOpen(!knowledgeBaseSidebarOpen)
                    }
                    className="w-11 h-11 bg-[#555555] rounded-[20px] flex items-center justify-center hover:bg-[#666666] transition-colors"
                    title="Knowledge Base"
                  >
                    <Library className="h-5 w-5 text-white" />
                  </button>

                  {/* Send Button */}
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
                This is A.I. and not a real person. Treat everything it says as
                fiction
              </p>
            </div>
          </div>
        </>
      </div>

      {/* Services Sidebar */}
      {servicesSidebarOpen && (
        <div className="w-80 border-l border-border/30 bg-secondary/20 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                Available Services
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setServicesSidebarOpen(false)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Services List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {getServices().map((service, index) => (
                <div
                  key={index}
                  className="bg-secondary/50 rounded-lg p-3 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group"
                  onClick={() => {
                    console.log(`Booking service: ${service.title}`);
                    alert(
                      `Opening booking for: ${service.title} (${service.duration} - ${service.price})`
                    );
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <service.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm mb-1 line-clamp-1">
                        {service.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="whitespace-nowrap">
                          {service.duration}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-primary whitespace-nowrap">
                          {service.price}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Base Sidebar */}
      {knowledgeBaseSidebarOpen && (
        <div className="w-80 border-l border-border/30 bg-secondary/20 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Knowledge Base</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setKnowledgeBaseSidebarOpen(false)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Explore {person.name}'s insights and experiences
            </p>
          </div>

          {/* Knowledge Chapters List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {getKnowledgeChapters().map((chapter) => (
                <div
                  key={chapter.id}
                  className="bg-secondary/50 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group"
                  onClick={() => {
                    // Add AI message explaining the chapter
                    const aiMessage: Message = {
                      id: (Date.now() + Math.random()).toString(),
                      role: 'assistant',
                      content: `Great choice! Let me tell you about "${chapter.title}". ${chapter.description}\n\nThis is one of my favorite topics to discuss. What specific aspect would you like to dive deeper into?`,
                      timestamp: new Date(),
                      links: [
                        {
                          title: 'Read Full Chapter',
                          url: `#chapter-${chapter.id}`,
                        },
                        {
                          title: 'Related Experience',
                          url: `#experience-${chapter.category.toLowerCase()}`,
                        },
                      ],
                    };
                    setMessages((prev) => [...prev, aiMessage]);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium group-hover:text-primary transition-colors text-sm line-clamp-2">
                      {chapter.title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-2" />
                  </div>

                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-relaxed">
                    {chapter.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {chapter.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {chapter.tags.length > 2 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          +{chapter.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground text-xs font-medium">
                      {chapter.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {getKnowledgeChapters().length === 0 && (
              <div className="text-center py-8">
                <Library className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-sm">
                  No knowledge base content yet
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Ask {person.name} about their experiences!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
