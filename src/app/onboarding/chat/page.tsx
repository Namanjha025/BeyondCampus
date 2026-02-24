"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react'

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

interface OnboardingData {
  location?: string
  targetCountry?: string
  courseType?: string
  major?: string
  currentEducation?: string
}

const ONBOARDING_STEPS = [
  {
    id: 'intro',
    question: "Hi! I'm Maya, your personal study abroad counselor. I'm here to help you navigate your journey to studying abroad. Before we begin, what should I call you?",
    field: 'nickname'
  },
  {
    id: 'location',
    question: "Nice to meet you, {name}! Which city and state are you from?",
    field: 'location'
  },
  {
    id: 'targetCountry',
    question: "Which country are you looking to study in?",
    field: 'targetCountry',
    options: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands']
  },
  {
    id: 'courseType',
    question: "What course are you planning to pursue?",
    field: 'courseType',
    options: ["Bachelor's", "Master's", 'PhD']
  },
  {
    id: 'major',
    question: "What major are you interested in?",
    field: 'major',
    options: ['Computer Science', 'Engineering', 'Business/MBA', 'Medicine', 'Data Science', 'Arts & Design']
  },
  {
    id: 'currentEducation',
    question: "What is your current education level?",
    field: 'currentEducation',
    options: ['High School', "Bachelor's Degree", "Master's Degree", 'Working Professional']
  }
]

export default function OnboardingChat() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({})
  const [userName, setUserName] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentCaption, setCurrentCaption] = useState('')
  const [userCaption, setUserCaption] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showOptions, setShowOptions] = useState(false)
  const [textInput, setTextInput] = useState('')
  
  // Speech recognition setup
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  // Store the transcript in a ref so we can process it later
  const finalTranscriptRef = useRef<string>('')

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        try {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('')
          
          setUserCaption(transcript)
          
          if (event.results[0].isFinal) {
            finalTranscriptRef.current = transcript
          }
        } catch (error) {
          console.error('Speech recognition result error:', error)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        // Process the final transcript when recognition ends
        if (finalTranscriptRef.current) {
          handleUserInput(finalTranscriptRef.current)
          finalTranscriptRef.current = ''
        }
      }
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
      
      // Start with the first message
      setTimeout(() => {
        speakMessage(ONBOARDING_STEPS[0].question, 0)
      }, 1000)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const speakMessage = (text: string, stepIndex?: number) => {
    const cleanText = text.replace('{name}', userName)
    setCurrentCaption(cleanText)
    
    // Show options for current step
    const step = stepIndex !== undefined ? stepIndex : currentStep
    const currentStepData = ONBOARDING_STEPS[step]
    if (currentStepData && currentStepData.options) {
      setTimeout(() => setShowOptions(true), 1000)
    }
    
    if (!soundEnabled || !synthRef.current) return

    try {
      setIsSpeaking(true)

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 1
      
      // Try to use a female voice
      const voices = synthRef.current.getVoices()
      const femaleVoice = voices.find((voice: any) => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen')
      )
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
      }

      synthRef.current.speak(utterance)
    } catch (error) {
      console.error('Speech synthesis error:', error)
      setIsSpeaking(false)
    }
  }

  const startListening = () => {
    if (!recognitionRef.current || isListening || isSpeaking) return
    
    setUserCaption('')
    setIsListening(true)
    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    
    recognitionRef.current.stop()
    setIsListening(false)
  }

  const handleUserInput = (input: string) => {
    const currentStepData = ONBOARDING_STEPS[currentStep]
    
    // Handle name input
    if (currentStep === 0) {
      setUserName(input)
    }

    // Update onboarding data
    if (currentStepData.field) {
      setOnboardingData(prev => ({
        ...prev,
        [currentStepData.field]: input
      }))
    }

    // Clear captions after a delay
    setTimeout(() => {
      setUserCaption('')
      setShowOptions(false)
    }, 2000)

    // Move to next step
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
      setTimeout(() => {
        speakMessage(ONBOARDING_STEPS[currentStep + 1].question, currentStep + 1)
      }, 2500)
    } else {
      completeOnboarding()
    }
  }

  const handleOptionClick = (option: string) => {
    setUserCaption(option)
    
    const currentStepData = ONBOARDING_STEPS[currentStep]
    
    // Update onboarding data
    if (currentStepData.field) {
      setOnboardingData(prev => ({
        ...prev,
        [currentStepData.field]: option
      }))
    }

    // Clear captions and hide options after a delay
    setTimeout(() => {
      setUserCaption('')
      setShowOptions(false)
    }, 1500)

    // Move to next step
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
      setTimeout(() => {
        speakMessage(ONBOARDING_STEPS[currentStep + 1].question, currentStep + 1)
      }, 2000)
    } else {
      completeOnboarding()
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!textInput.trim() || isSpeaking) return
    
    setUserCaption(textInput)
    handleUserInput(textInput)
    setTextInput('')
  }

  const completeOnboarding = async () => {
    setIsProcessing(true)
    speakMessage("Excellent! I've gathered all the information I need. Now let me show you what I can do to help you achieve your study abroad dreams...")

    try {
      const payload = {
        ...onboardingData,
        userName,
        onboardingCompleted: true
      }
      
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setTimeout(() => {
          router.push('/onboarding/preparing')
        }, 4000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Onboarding failed:', response.status, errorData)
        
        // If unauthorized, save data locally and proceed
        if (response.status === 401) {
          // Store onboarding data in localStorage for later use
          localStorage.setItem('pendingOnboarding', JSON.stringify(payload))
          setTimeout(() => {
            router.push('/onboarding/preparing')
          }, 4000)
        } else {
          setIsProcessing(false)
        }
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      setIsProcessing(false)
    }
  }

  const currentStepData = ONBOARDING_STEPS[currentStep]
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Close button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4 pb-48">
        {/* Animated Gradient Orb */}
        <motion.div
          className="relative w-64 h-64 mb-8"
          animate={{
            scale: isSpeaking ? [1, 1.1, 1] : isListening ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: isSpeaking ? 1.5 : 2,
            repeat: isSpeaking || isListening ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 opacity-80 blur-xl" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-300 via-white to-yellow-400 opacity-60 blur-md" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-orange-400/90 via-white/80 to-yellow-500/90 shadow-2xl">
            {/* Inner glow effect */}
            <div className="absolute inset-4 rounded-full bg-white/30 blur-xl" />
            
            {/* Sound wave animation when speaking/listening */}
            {(isSpeaking || isListening) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <motion.div
                      key={`wave-${index}`}
                      className="w-1 bg-white/60 rounded-full"
                      animate={{
                        height: isSpeaking ? ['20px', '40px', '20px'] : ['15px', '30px', '15px'],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: index * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Captions */}
        <div className="w-full max-w-2xl px-4 mb-8">
          <AnimatePresence mode="wait">
            {currentCaption && (
              <motion.div
                key="current-caption"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-4"
              >
                <p className="text-xl text-white/90 leading-relaxed">{currentCaption}</p>
              </motion.div>
            )}
            
            {userCaption && (
              <motion.div
                key="user-caption"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <p className="text-lg text-gray-400 italic">&ldquo;{userCaption}&rdquo;</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Options (if available) */}
        <AnimatePresence>
          {showOptions && currentStepData.options && !isListening && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl px-4 mb-8"
            >
              <p className="text-center text-sm text-gray-400 mb-6">Choose an option or type your own answer:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentStepData.options.map((option, index) => (
                  <motion.button
                    key={`${currentStep}-option-${index}-${option}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionClick(option)}
                    className="px-6 py-4 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-orange-500/40 rounded-2xl text-white hover:from-orange-500/20 hover:to-orange-500/10 hover:border-orange-500/60 transition-all font-medium shadow-lg hover:shadow-orange-500/20"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!isSpeaking && !isListening && !userCaption && !showOptions && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-sm mt-6"
          >
            Tap the microphone to speak or type below
          </motion.p>
        )}
      </div>

      {/* Bottom Controls Section */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-black/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Microphone button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking || isProcessing}
              className={`p-5 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? (
                <MicOff className="h-7 w-7 text-white" />
              ) : (
                <Mic className="h-7 w-7 text-white" />
              )}
            </motion.button>

            {/* Sound toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSoundEnabled(!soundEnabled)
                if (synthRef.current) {
                  synthRef.current.cancel()
                }
              }}
              className="p-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
            >
              {soundEnabled ? (
                <Volume2 className="h-7 w-7 text-white" />
              ) : (
                <VolumeX className="h-7 w-7 text-white" />
              )}
            </motion.button>
          </div>

          {/* Text Input */}
          <form onSubmit={handleTextSubmit}>
            <div className="relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your answer here..."
                disabled={isSpeaking || isProcessing}
                className="w-full px-6 py-4 pr-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-white/15 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isSpeaking || isProcessing}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg 
                  className="w-5 h-5 text-black" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              Press Enter to send • Use microphone for voice input
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}