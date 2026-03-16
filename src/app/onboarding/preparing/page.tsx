'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Globe,
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Sparkles,
  Loader2,
} from 'lucide-react';
import MayaAvatar from '@/components/MayaAvatar';

const preparations = [
  {
    id: 'ai',
    icon: Brain,
    text: 'Preparing your AI counselor',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'universities',
    icon: Globe,
    text: 'Loading university database',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'network',
    icon: Users,
    text: 'Connecting to student network',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'documents',
    icon: FileText,
    text: 'Setting up document templates',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'calendar',
    icon: Calendar,
    text: 'Syncing important deadlines',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'analytics',
    icon: TrendingUp,
    text: 'Analyzing your profile',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'final',
    icon: Sparkles,
    text: 'Finalizing your experience',
    color: 'from-yellow-500 to-yellow-600',
  },
];

export default function PreparingResources() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [currentPrep, setCurrentPrep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalSteps = preparations.length;
    const progressPerStep = 100 / totalSteps;
    const stepDuration = 2500; // milliseconds per step

    // Change preparation message and update progress
    const prepTimer = setInterval(() => {
      setCurrentPrep((prev) => {
        const nextStep = prev + 1;

        // Update progress based on current step
        setProgress(Math.min((nextStep / totalSteps) * 100, 100));

        if (nextStep >= totalSteps) {
          clearInterval(prepTimer);
          // Refresh session and redirect
          setTimeout(async () => {
            // Force session refresh to get updated onboardingCompleted status
            await update();
            router.push('/');
          }, 1000);
          return prev;
        }
        return nextStep;
      });
    }, stepDuration);

    // Set initial progress
    setProgress(progressPerStep);

    return () => {
      clearInterval(prepTimer);
    };
  }, [router]);

  const currentPreparation = preparations[currentPrep];

  // Ensure we have a valid preparation object
  if (!currentPreparation) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage:
          'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)',
      }}
    >
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-8 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center flex-1 max-w-lg mx-auto">
          {/* Maya Avatar */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <MayaAvatar size="lg" animated />
            </motion.div>
          </div>

          {/* Preparing text animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPrep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${currentPreparation.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                {React.createElement(currentPreparation.icon, {
                  className: 'w-8 h-8 text-white',
                })}
              </motion.div>

              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">
                {currentPreparation.text}
              </h2>

              <p className="text-sm text-gray-400">
                Getting everything ready for you...
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Section - Progress and indicators */}
          <div className="w-full max-w-md mx-auto mt-8 space-y-4">
            {/* Progress bar */}
            <div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                {Math.round(progress)}% Complete
              </p>
            </div>

            {/* Loading spinner */}
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-6 h-6 text-orange-500" />
              </motion.div>
            </div>

            {/* Preparation dots */}
            <div className="flex justify-center gap-1.5">
              {preparations.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`transition-all duration-500 ${
                    index <= currentPrep
                      ? 'w-1.5 h-1.5 bg-orange-500'
                      : 'w-1.5 h-1.5 bg-gray-600'
                  } rounded-full`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
