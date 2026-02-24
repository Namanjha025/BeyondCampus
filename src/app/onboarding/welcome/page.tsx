"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import MayaAvatar from '@/components/MayaAvatar'

export default function OnboardingWelcome() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState(0)

  useEffect(() => {
    // Prevent scrolling during animation
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const screens = [
    {
      id: 0,
      content: (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <motion.h1 
            className="text-6xl font-bold mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Welcome to BeyondCampus
          </motion.h1>
          <motion.p 
            className="text-2xl text-gray-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Your journey to studying abroad begins here
          </motion.p>
        </motion.div>
      )
    },
    {
      id: 1,
      content: (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="mb-8 mx-auto w-fit"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <MayaAvatar size="xl" animated />
          </motion.div>
          <motion.h2 
            className="text-5xl font-bold mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            Meet Maya
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Your personal AI counselor who will guide you through your journey, from dreams to reality
          </motion.p>
        </motion.div>
      )
    }
  ]

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1)
    } else {
      // Transition to chat
      router.push('/onboarding/chat')
    }
  }

  const handleSkip = () => {
    router.push('/onboarding/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative" 
         style={{ 
           backgroundColor: '#0a0a0a',
           backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)'
         }}>
      {/* Skip button */}
      <motion.button
        onClick={handleSkip}
        className="absolute top-8 right-8 text-gray-500 hover:text-gray-300 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Skip Intro →
      </motion.button>

      {/* Main content */}
      <div className="w-full max-w-4xl px-8">
        <AnimatePresence mode="wait">
          <div key={currentScreen}>
            {screens[currentScreen].content}
          </div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          className="flex flex-col items-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {/* Progress dots */}
          <div className="flex gap-2 mb-8">
            {screens.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentScreen 
                    ? 'bg-orange-500 w-8' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Next button */}
          <motion.button
            onClick={handleNext}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-all transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentScreen === screens.length - 1 ? "Let's Begin" : "Next"}
          </motion.button>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '20%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ bottom: '20%', right: '10%' }}
        />
      </div>
    </div>
  )
}