'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Send } from 'lucide-react';
import MayaAvatar from './MayaAvatar';

interface MayaFloatingAssistantProps {
  context?: 'universities' | 'profile' | 'applications' | 'general';
  pageData?: any;
  onAction?: (action: any) => void;
}

export default function MayaFloatingAssistant({
  context = 'general',
  pageData,
  onAction,
}: MayaFloatingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([]);

  // Initial greeting based on context
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = {
        universities:
          "Hi! I'm Maya. I can help you find the perfect universities, explain rankings, or answer any questions about programs. What would you like to know?",
        profile:
          'Hello! I can help you complete your profile or explain what information would strengthen your applications.',
        applications:
          "I'm here to help with your applications. I can track deadlines, review documents, or guide you through requirements.",
        general: "Hi! I'm Maya, your AI counselor. How can I assist you today?",
      };

      setMessages([
        {
          role: 'assistant',
          content: greetings[context],
        },
      ]);
    }
  }, [isOpen, context]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I understand you're asking about " +
            message +
            '. Let me help you with that...',
        },
      ]);
    }, 1000);

    setMessage('');
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <MayaAvatar size="sm" />

              {/* Pulse animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-orange-500 opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-[#0a0a0a] rounded-2xl shadow-2xl border border-gray-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <MayaAvatar size="sm" />
                <div>
                  <h3 className="text-white font-semibold">Maya</h3>
                  <p className="text-xs text-gray-400">AI Counselor</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2 rounded-full transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
