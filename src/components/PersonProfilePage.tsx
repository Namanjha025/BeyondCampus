'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Target,
  Calendar,
  Star,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Trophy,
  Building,
  Mail,
  Globe,
  Linkedin,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonProfileProps {
  personId: string;
}

interface ExtendedPerson {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  category: 'mentor' | 'student' | 'counselor' | 'alumni';
  bio: string;
  avatar?: string;

  // Extended profile information
  skills: string[];
  expertise: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
    gpa?: string;
  }[];
  achievements: string[];
  services: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    duration: string;
    price: string;
    description: string;
  }[];
  rating: number;
  totalReviews: number;
  yearsExperience: number;
  contact: {
    email?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
  languages: string[];
  availability: string;
  responseTime: string;
}

export default function PersonProfilePage({ personId }: PersonProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');

  // Extended person data with comprehensive information
  const personData: { [key: string]: ExtendedPerson } = {
    '1': {
      id: '1',
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'Google',
      location: 'Mountain View, CA',
      category: 'mentor',
      bio: 'Former Stanford CS student, now leading product teams at Google. Love helping students navigate tech careers!',
      skills: [
        'Product Management',
        'Data Analysis',
        'User Research',
        'Agile',
        'Leadership',
        'Strategy',
      ],
      expertise: [
        'Tech Career Guidance',
        'Product Strategy',
        'Team Leadership',
        'User Experience',
        'Market Research',
      ],
      experience: [
        {
          title: 'Senior Product Manager',
          company: 'Google',
          duration: '2021 - Present',
          description:
            'Leading cross-functional teams to develop consumer-facing products used by millions of users globally. Managed product roadmaps and strategic initiatives.',
        },
        {
          title: 'Product Manager',
          company: 'Meta',
          duration: '2019 - 2021',
          description:
            'Worked on social commerce features and user engagement tools. Collaborated with engineering and design teams to ship high-impact features.',
        },
        {
          title: 'Associate Product Manager',
          company: 'Uber',
          duration: '2017 - 2019',
          description:
            'Started career in ride-sharing optimization and driver experience improvements. Learned fundamentals of product management in a fast-paced environment.',
        },
      ],
      education: [
        {
          degree: 'MS Computer Science',
          school: 'Stanford University',
          year: '2017',
          gpa: '3.9',
        },
        {
          degree: 'BS Computer Engineering',
          school: 'UC Berkeley',
          year: '2015',
          gpa: '3.8',
        },
      ],
      achievements: [
        'Led product that achieved 50M+ monthly active users',
        "Recognized as 'Rising Star' at Google 2022",
        'Published research on user behavior analytics',
        'Mentored 25+ students into tech careers',
        'Speaker at ProductCon 2023',
      ],
      services: [
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
      ],
      rating: 4.9,
      totalReviews: 127,
      yearsExperience: 7,
      contact: {
        email: 'sarah.chen@email.com',
        linkedin: 'linkedin.com/in/sarahchen',
        website: 'sarahchen.dev',
      },
      languages: ['English', 'Mandarin', 'Spanish'],
      availability: 'Available for sessions Mon-Fri, 6-9 PM PST',
      responseTime: 'Usually responds within 2 hours',
    },
    '2': {
      id: '2',
      name: 'Marcus Johnson',
      role: 'Senior Software Engineer',
      company: 'Meta',
      location: 'Seattle, WA',
      category: 'mentor',
      bio: 'Full-stack engineer passionate about mentoring. Specialized in system design and career transitions.',
      skills: [
        'JavaScript',
        'Python',
        'React',
        'Node.js',
        'System Design',
        'AWS',
        'Docker',
        'GraphQL',
      ],
      expertise: [
        'Full-Stack Development',
        'System Architecture',
        'Code Reviews',
        'Technical Interviews',
        'Career Transitions',
      ],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Meta',
          duration: '2020 - Present',
          description:
            "Building scalable systems for Instagram's messaging platform. Leading architecture decisions for high-throughput services.",
        },
        {
          title: 'Software Engineer',
          company: 'Airbnb',
          duration: '2018 - 2020',
          description:
            'Developed booking and payment systems. Improved platform reliability and user experience across web and mobile.',
        },
        {
          title: 'Junior Developer',
          company: 'Startup Inc',
          duration: '2016 - 2018',
          description:
            'Started career building e-commerce platforms. Learned fundamentals of web development and agile methodologies.',
        },
      ],
      education: [
        {
          degree: 'MS Software Engineering',
          school: 'University of Washington',
          year: '2016',
        },
        {
          degree: 'BS Computer Science',
          school: 'Georgia Tech',
          year: '2014',
        },
      ],
      achievements: [
        'Designed system serving 100M+ daily requests',
        'Mentored 15+ junior engineers to promotion',
        'Open source contributor with 5K+ GitHub stars',
        'Tech conference speaker (ReactConf, JSConf)',
        'Led engineering team of 8 developers',
      ],
      services: [
        {
          icon: MessageCircle,
          title: 'System Design Coaching',
          duration: '60 min',
          price: '$85',
          description:
            'Learn to design scalable systems for technical interviews',
        },
        {
          icon: Target,
          title: 'Code Review Session',
          duration: '45 min',
          price: '$60',
          description: 'Get expert feedback on your code and best practices',
        },
        {
          icon: Lightbulb,
          title: 'Technical Interview Prep',
          duration: '60 min',
          price: '$90',
          description: 'Practice coding interviews with real-time feedback',
        },
      ],
      rating: 4.8,
      totalReviews: 89,
      yearsExperience: 8,
      contact: {
        email: 'marcus.j@email.com',
        linkedin: 'linkedin.com/in/marcusjdev',
        website: 'marcusdev.io',
      },
      languages: ['English'],
      availability: 'Available evenings and weekends PST',
      responseTime: 'Usually responds within 4 hours',
    },
    '3': {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Graduate Student',
      company: 'MIT',
      location: 'Cambridge, MA',
      category: 'student',
      bio: 'PhD candidate in AI/ML. Happy to share insights about graduate school and research opportunities.',
      skills: [
        'Machine Learning',
        'Python',
        'PyTorch',
        'Research',
        'Data Science',
        'Statistics',
      ],
      expertise: [
        'AI/ML Research',
        'Graduate School Navigation',
        'Research Methodology',
        'Academic Writing',
      ],
      experience: [
        {
          title: 'PhD Candidate',
          company: 'MIT CSAIL',
          duration: '2021 - Present',
          description:
            'Researching novel approaches to natural language processing and computer vision. Published 5 peer-reviewed papers.',
        },
        {
          title: 'Research Intern',
          company: 'OpenAI',
          duration: 'Summer 2023',
          description:
            'Worked on large language model optimization and safety research. Contributed to internal research publications.',
        },
        {
          title: 'ML Engineer Intern',
          company: 'DeepMind',
          duration: 'Summer 2022',
          description:
            'Developed reinforcement learning algorithms for game AI. Gained experience with cutting-edge research methodologies.',
        },
      ],
      education: [
        {
          degree: 'PhD Computer Science (In Progress)',
          school: 'MIT',
          year: 'Expected 2025',
        },
        {
          degree: 'MS Computer Science',
          school: 'Carnegie Mellon University',
          year: '2021',
          gpa: '3.95',
        },
        {
          degree: 'BS Mathematics & Computer Science',
          school: 'UC San Diego',
          year: '2019',
          gpa: '3.9',
        },
      ],
      achievements: [
        '5 peer-reviewed publications in top-tier conferences',
        'Best Paper Award at NeurIPS 2023',
        'NSF Graduate Research Fellowship recipient',
        'Teaching Assistant for Advanced ML course',
        'Organizing committee member for ML conference',
      ],
      services: [
        {
          icon: BookOpen,
          title: 'Graduate School Application Review',
          duration: '45 min',
          price: '$40',
          description:
            'Get insights on PhD applications and research proposals',
        },
        {
          icon: Users,
          title: 'Research Mentorship Session',
          duration: '60 min',
          price: '$50',
          description:
            'Guidance on research methodology and academic career paths',
        },
        {
          icon: Target,
          title: 'Academic Writing Workshop',
          duration: '60 min',
          price: '$45',
          description:
            'Learn to write compelling research papers and proposals',
        },
      ],
      rating: 4.7,
      totalReviews: 34,
      yearsExperience: 3,
      contact: {
        email: 'emily.r@mit.edu',
        linkedin: 'linkedin.com/in/emilyrodriguezml',
      },
      languages: ['English', 'Spanish'],
      availability: 'Flexible schedule, mostly evenings EST',
      responseTime: 'Usually responds within 6 hours',
    },
    '4': {
      id: '4',
      name: 'Dr. Michael Park',
      role: 'Admissions Director',
      company: 'Stanford University',
      location: 'Stanford, CA',
      category: 'counselor',
      bio: '15+ years in admissions. Expert in holistic application review and essay guidance.',
      skills: [
        'Admissions Strategy',
        'Essay Writing',
        'Interview Coaching',
        'College Planning',
        'Scholarship Guidance',
      ],
      expertise: [
        'College Admissions',
        'Application Strategy',
        'Essay Development',
        'Interview Preparation',
        'Financial Aid',
      ],
      experience: [
        {
          title: 'Director of Admissions',
          company: 'Stanford University',
          duration: '2018 - Present',
          description:
            'Leading holistic review process for undergraduate admissions. Developed new evaluation frameworks and diversity initiatives.',
        },
        {
          title: 'Senior Admissions Officer',
          company: 'Harvard University',
          duration: '2012 - 2018',
          description:
            'Reviewed thousands of applications and conducted interviews. Specialized in STEM and international student admissions.',
        },
        {
          title: 'Admissions Counselor',
          company: 'Northwestern University',
          duration: '2008 - 2012',
          description:
            'Started career in college admissions. Focused on regional recruitment and student outreach programs.',
        },
      ],
      education: [
        {
          degree: 'PhD Education Policy',
          school: 'Stanford University',
          year: '2015',
        },
        {
          degree: 'MEd Higher Education',
          school: 'Harvard Graduate School of Education',
          year: '2008',
        },
        {
          degree: 'BA Psychology',
          school: 'Yale University',
          year: '2006',
        },
      ],
      achievements: [
        'Reviewed 10,000+ college applications',
        'Developed holistic admissions framework adopted by 20+ universities',
        'Published research on admissions equity and access',
        'Keynote speaker at National Association for College Admission Counseling',
        'Helped implement need-blind admissions policies',
      ],
      services: [
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
          icon: Lightbulb,
          title: 'Interview Preparation',
          duration: '45 min',
          price: '$90',
          description: 'Practice for college admissions interviews',
        },
      ],
      rating: 4.9,
      totalReviews: 203,
      yearsExperience: 15,
      contact: {
        email: 'm.park@stanford.edu',
        linkedin: 'linkedin.com/in/drmikepark',
        website: 'stanfordadmissions.edu/staff',
      },
      languages: ['English', 'Korean'],
      availability: 'Available Mon-Fri, 9 AM - 5 PM PST',
      responseTime: 'Usually responds within 24 hours',
    },
    '5': {
      id: '5',
      name: 'Alex Kumar',
      role: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Angeles, CA',
      category: 'alumni',
      bio: 'UC Berkeley alum working in entertainment tech. Passionate about data science and analytics careers.',
      skills: [
        'Data Science',
        'Machine Learning',
        'Python',
        'SQL',
        'Statistics',
        'A/B Testing',
        'Recommendation Systems',
      ],
      expertise: [
        'Data Analytics',
        'Machine Learning',
        'Business Intelligence',
        'Career Transitions',
        'Tech Industry',
      ],
      experience: [
        {
          title: 'Senior Data Scientist',
          company: 'Netflix',
          duration: '2021 - Present',
          description:
            'Building recommendation algorithms and content analytics systems. Leading data science initiatives for original content strategy.',
        },
        {
          title: 'Data Scientist',
          company: 'Spotify',
          duration: '2019 - 2021',
          description:
            'Developed music recommendation systems and user behavior analytics. Improved user engagement through personalization algorithms.',
        },
        {
          title: 'Junior Data Analyst',
          company: 'Lyft',
          duration: '2017 - 2019',
          description:
            'Started career analyzing ride patterns and demand forecasting. Built dashboards and reporting systems for business stakeholders.',
        },
      ],
      education: [
        {
          degree: 'MS Statistics',
          school: 'UC Berkeley',
          year: '2017',
        },
        {
          degree: 'BS Applied Mathematics',
          school: 'UC Berkeley',
          year: '2015',
          gpa: '3.7',
        },
      ],
      achievements: [
        'Improved Netflix recommendation CTR by 15%',
        'Published paper on recommendation systems at RecSys conference',
        'Led data science team of 6 analysts',
        'Created open-source ML library with 2K+ stars',
        'Mentored 20+ students into data science careers',
      ],
      services: [
        {
          icon: TrendingUp,
          title: 'Data Science Career Roadmap',
          duration: '60 min',
          price: '$80',
          description: 'Navigate your path into data science and analytics',
        },
        {
          icon: Target,
          title: 'Portfolio Review Session',
          duration: '45 min',
          price: '$65',
          description:
            'Get feedback on your data science projects and portfolio',
        },
        {
          icon: MessageCircle,
          title: 'Technical Interview Prep',
          duration: '60 min',
          price: '$85',
          description: 'Practice data science interviews and case studies',
        },
      ],
      rating: 4.8,
      totalReviews: 67,
      yearsExperience: 7,
      contact: {
        email: 'alex.kumar@email.com',
        linkedin: 'linkedin.com/in/alexkumardata',
        website: 'alexdatascience.com',
      },
      languages: ['English', 'Hindi'],
      availability: 'Evenings and weekends PST',
      responseTime: 'Usually responds within 3 hours',
    },
    '6': {
      id: '6',
      name: 'Jessica Wu',
      role: 'Investment Banking Analyst',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      category: 'mentor',
      bio: 'Wharton MBA helping students break into finance. Specialized in investment banking and consulting prep.',
      skills: [
        'Financial Modeling',
        'Valuation',
        'Investment Banking',
        'Consulting',
        'Excel',
        'PowerPoint',
        'Leadership',
      ],
      expertise: [
        'Finance Career Guidance',
        'Investment Banking',
        'Consulting',
        'MBA Applications',
        'Interview Prep',
      ],
      experience: [
        {
          title: 'Investment Banking Analyst',
          company: 'Goldman Sachs',
          duration: '2022 - Present',
          description:
            'Working on M&A transactions and IPOs in the technology sector. Built financial models and pitch presentations for Fortune 500 clients.',
        },
        {
          title: 'Strategy Consultant',
          company: 'McKinsey & Company',
          duration: '2019 - 2021',
          description:
            'Advised Fortune 500 companies on growth strategy and operational efficiency. Led client engagements in healthcare and technology sectors.',
        },
        {
          title: 'Business Analyst',
          company: 'Bain & Company',
          duration: '2017 - 2019',
          description:
            'Started career in management consulting. Developed analytical and client management skills across various industries.',
        },
      ],
      education: [
        {
          degree: 'MBA',
          school: 'Wharton School, University of Pennsylvania',
          year: '2022',
        },
        {
          degree: 'BA Economics',
          school: 'University of Chicago',
          year: '2017',
          gpa: '3.8',
        },
      ],
      achievements: [
        'Closed $2B+ in M&A transactions',
        'Top performer in analyst class at Goldman Sachs',
        "Wharton Dean's List recipient",
        'Published case study on fintech valuations',
        'Mentored 30+ students into finance careers',
      ],
      services: [
        {
          icon: TrendingUp,
          title: 'Finance Career Strategy',
          duration: '60 min',
          price: '$120',
          description:
            'Navigate investment banking and consulting career paths',
        },
        {
          icon: Target,
          title: 'Finance Interview Prep',
          duration: '60 min',
          price: '$110',
          description:
            'Practice technical and behavioral interviews for finance roles',
        },
        {
          icon: BookOpen,
          title: 'MBA Application Review',
          duration: '45 min',
          price: '$95',
          description:
            'Get feedback on your MBA essays and application strategy',
        },
      ],
      rating: 4.9,
      totalReviews: 156,
      yearsExperience: 7,
      contact: {
        email: 'jessica.wu@email.com',
        linkedin: 'linkedin.com/in/jessicawufinance',
      },
      languages: ['English', 'Mandarin'],
      availability: 'Available weekends and some weekday evenings EST',
      responseTime: 'Usually responds within 4 hours',
    },
  };

  const person = personData[personId] || personData['1'];

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

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'mentor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'student':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'counselor':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'alumni':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const tabContent = {
    about: (
      <div className="space-y-8">
        {/* Bio Section */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
          <p className="text-muted-foreground leading-relaxed">{person.bio}</p>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {person.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expertise */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Areas of Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {person.expertise.map((area, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {person.languages.map((language, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {language}
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Availability
          </h3>
          <p className="text-muted-foreground">{person.availability}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {person.responseTime}
          </p>
        </div>
      </div>
    ),
    experience: (
      <div className="space-y-6">
        {person.experience.map((exp, index) => (
          <div
            key={index}
            className="border-l-2 border-primary/30 pl-6 pb-6 relative"
          >
            <div className="absolute -left-2 top-0 w-3 h-3 bg-primary rounded-full"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {exp.title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span className="font-medium">{exp.company}</span>
                <span>•</span>
                <span>{exp.duration}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
    education: (
      <div className="space-y-6">
        {person.education.map((edu, index) => (
          <div key={index} className="bg-secondary/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {edu.degree}
                </h3>
                <p className="text-muted-foreground font-medium mb-2">
                  {edu.school}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{edu.year}</span>
                  </div>
                  {edu.gpa && (
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    achievements: (
      <div className="space-y-4">
        {person.achievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg"
          >
            <div className="p-1 rounded-full bg-primary/10 mt-1">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <p className="text-foreground leading-relaxed">{achievement}</p>
          </div>
        ))}
      </div>
    ),
    services: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {person.services.map((service, index) => (
          <div
            key={index}
            className="bg-secondary/30 rounded-lg p-6 border border-border/30 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <service.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">
                  {service.title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span>{service.duration}</span>
                  <span>•</span>
                  <span className="font-semibold text-primary">
                    {service.price}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <Button size="sm" className="w-full">
                  Book Session
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-background/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-secondary/70"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {person.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-secondary/20 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarFallback
                  className={cn(
                    'text-white text-4xl font-bold',
                    getCategoryColor(person.category)
                  )}
                >
                  {person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              <Badge
                className={cn(
                  'mb-4 capitalize',
                  getCategoryBadgeColor(person.category)
                )}
              >
                {person.category}
              </Badge>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.floor(person.rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">
                  {person.rating}
                </span>
                <span className="text-muted-foreground text-sm">
                  ({person.totalReviews} reviews)
                </span>
              </div>

              {/* Experience Badge */}
              <Badge variant="outline" className="mb-6">
                {person.yearsExperience} years of experience
              </Badge>
            </div>

            {/* Right Column - Details */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {person.name}
                </h1>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    <Briefcase className="h-5 w-5" />
                    <span>
                      {person.role} at {person.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{person.location}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {person.contact.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{person.contact.email}</span>
                  </div>
                )}
                {person.contact.linkedin && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Linkedin className="h-4 w-4" />
                    <span className="truncate">{person.contact.linkedin}</span>
                  </div>
                )}
                {person.contact.website && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{person.contact.website}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => router.push(`/person/${person.id}`)}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Start Chat
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    console.log(`Connecting with ${person.name}`);
                    alert(`Opening connection request to ${person.name}...`);
                  }}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
            {[
              { id: 'about', label: 'About', icon: User },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'services', label: 'Services', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-background rounded-lg">
          {tabContent[activeTab as keyof typeof tabContent]}
        </div>
      </div>
    </div>
  );
}
