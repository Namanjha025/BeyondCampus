'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Target,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Globe,
  Sparkles,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import MayaAvatar from '@/components/MayaAvatar';

const capabilities = [
  {
    id: 'personalized',
    icon: Brain,
    title: 'Personalized Guidance',
    description:
      'Maya remembers your goals, preferences, and timeline to provide tailored advice for your unique journey',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'universities',
    icon: Globe,
    title: 'University Matching',
    description:
      'Discover universities that match your profile, budget, and aspirations across multiple countries',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'applications',
    icon: FileText,
    title: 'Application Support',
    description:
      'Get help with essays, SOPs, and documents. Maya guides you through each application step',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'deadlines',
    icon: Calendar,
    title: 'Deadline Management',
    description:
      'Never miss a deadline. Maya tracks important dates and reminds you what needs attention',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'progress',
    icon: TrendingUp,
    title: 'Progress Tracking',
    description:
      'Visualize your journey with clear milestones and actionable next steps',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'network',
    icon: Users,
    title: 'Student Network',
    description:
      'Connect with students who have walked this path. Learn from their experiences',
    color: 'from-indigo-500 to-indigo-600',
  },
];

export default function CapabilitiesShowcase() {
  const router = useRouter();
  const [currentCapability, setCurrentCapability] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentCapability((prev) =>
        prev < capabilities.length - 1 ? prev + 1 : prev
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [autoPlay, currentCapability]);

  useEffect(() => {
    // Stop autoplay when we reach the last capability
    if (currentCapability === capabilities.length - 1) {
      setAutoPlay(false);
    }
  }, [currentCapability]);

  const handleGetStarted = () => {
    // Redirect to main AI assistant
    // Using window.location to ensure clean navigation
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Skip button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-8 right-8 z-20"
      >
        <button
          onClick={handleGetStarted}
          className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
        >
          Skip to AI Assistant →
        </button>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-between">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="mb-6 inline-block"
          >
            <MayaAvatar size="lg" animated />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Meet Your AI Career Counselor
          </h1>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center space-y-12 max-w-6xl mx-auto w-full">
          {/* Capabilities Carousel */}
          <div className="relative">
            <div className="relative min-h-[250px] md:min-h-[300px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCapability}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center max-w-3xl px-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${capabilities[currentCapability].color} rounded-2xl flex items-center justify-center shadow-2xl`}
                    >
                      {React.createElement(
                        capabilities[currentCapability].icon,
                        {
                          className: 'w-10 h-10 text-white',
                        }
                      )}
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl md:text-3xl font-bold mb-3"
                    >
                      {capabilities[currentCapability].title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-base md:text-lg text-gray-300 max-w-xl mx-auto"
                    >
                      {capabilities[currentCapability].description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-8">
              {capabilities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentCapability(index);
                    setAutoPlay(false);
                  }}
                  className={`transition-all duration-300 ${
                    index === currentCapability
                      ? 'w-8 h-2 bg-orange-500'
                      : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                  } rounded-full`}
                />
              ))}
            </div>
          </div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border ${
                  currentCapability === index
                    ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                    : 'border-gray-700'
                } cursor-pointer transition-all hover:scale-105 flex flex-col items-center text-center`}
                onClick={() => {
                  setCurrentCapability(index);
                  setAutoPlay(false);
                }}
              >
                <capability.icon className="w-6 h-6 md:w-8 md:h-8 text-orange-400 mb-2" />
                <h3 className="font-semibold text-sm">{capability.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-16"
        >
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 text-green-400 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-base">
                Your profile is set up and Maya is ready!
              </span>
            </div>
            <p className="text-gray-400 text-base">
              Start your personalized study abroad journey now
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-semibold text-lg shadow-2xl shadow-orange-500/25 flex items-center gap-2 mx-auto hover:shadow-orange-500/40 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Ready to Get Started
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
