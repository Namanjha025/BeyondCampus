'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// BFF Chat API (non-streaming in MVP)
const sendTwinChat = async (
  twinId: string,
  text: string,
  viewerThreadId: string,
  memoryBlockId?: string,
  chapterId?: string
) => {
  const res = await fetch(`/api/twins/${twinId}/chat/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      viewer_thread_id: viewerThreadId,
      notebook_id: memoryBlockId,
      chapter_id: chapterId,
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Chat API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data as { ai_text: string; citations?: any[] };
};

interface Message {
  id: string;
  role: 'twin' | 'visitor';
  content: string;
  timestamp: Date;
}

// viewer thread helper (UUID)
const createViewerThreadId = () => crypto.randomUUID();

export default function PublishedTwin() {
  const params = useParams();
  const twinSlug = params?.twinSlug as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visitorId] = useState(
    `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const [initialized, setInitialized] = useState(false);
  const [creatorUserId, setCreatorUserId] = useState<string | null>(null);
  const [twinData, setTwinData] = useState<any>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Load twin data first
  useEffect(() => {
    if (twinSlug && !twinData) {
      loadTwinData();
    }
  }, [twinSlug, twinData]);

  // Initialize twin chat after data is loaded
  useEffect(() => {
    if (!initialized && twinData && creatorUserId) {
      setInitialized(true);
      initializeTwinChat();
    }
  }, [twinData, creatorUserId, initialized]);

  const loadTwinData = async () => {
    try {
      console.log('Loading twin data for slug:', twinSlug);
      const response = await fetch(`/api/twins/slug/${twinSlug}`);

      if (response.ok) {
        const result = await response.json();
        console.log('Twin data loaded:', result.twin);
        setTwinData(result.twin);
        setCreatorUserId(result.twin.userId);
      } else {
        console.error('Failed to load twin data');
        // Fallback - try to extract from URL structure if needed
      }
    } catch (error) {
      console.error('Error loading twin data:', error);
    }
  };

  const initializeTwinChat = async () => {
    try {
      setIsTyping(true);
      console.log('Initializing twin chat for:', twinSlug);

      // Create viewer thread id (UUID)
      const newThreadId = createViewerThreadId();
      setThreadId(newThreadId);
      console.log('Thread created:', newThreadId);

      // Get initial greeting from the twin
      const greetingId = Date.now().toString();
      const greeting: Message = {
        id: greetingId,
        role: 'twin',
        content: '',
        timestamp: new Date(),
      };

      setMessages([greeting]);

      // Ask for initial greeting via BFF Chat API (non-streaming)
      const res = await sendTwinChat(twinData.id, 'Hi', newThreadId);
      const fullMessage =
        res.ai_text ||
        `Hello! I'm ${twinData.twinName || twinSlug.replace('-', ' ')}. How can I help you today?`;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === greetingId ? { ...msg, content: fullMessage } : msg
        )
      );
      setIsTyping(false);
    } catch (error) {
      console.error('Error initializing twin chat:', error);
      const fallbackGreeting: Message = {
        id: Date.now().toString(),
        role: 'twin',
        content: `Hello! I'm ${twinData?.twinName || twinSlug.replace('-', ' ')}. How can I help you today?`,
        timestamp: new Date(),
      };
      setMessages([fallbackGreeting]);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !threadId) return;

    const visitorMessage: Message = {
      id: Date.now().toString(),
      role: 'visitor',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, visitorMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    // Create placeholder for twin response
    const twinMessageId = (Date.now() + 1).toString();
    const twinMessage: Message = {
      id: twinMessageId,
      role: 'twin',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, twinMessage]);

    try {
      const res = await sendTwinChat(
        twinData.id,
        visitorMessage.content,
        threadId
      );
      const fullMessage =
        res.ai_text ||
        "I apologize, but I'm having trouble responding right now. Please try again.";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === twinMessageId ? { ...msg, content: fullMessage } : msg
        )
      );
      setIsTyping(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === twinMessageId
            ? {
                ...msg,
                content:
                  "I apologize, but I'm having trouble responding right now. Please try again.",
              }
            : msg
        )
      );
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {/* Header */}
      <div className="border-b border-[hsl(0_0%_18%)] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {twinSlug.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {twinData?.twinName || twinSlug.replace('-', ' ')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {twinData?.tagline || 'Chat with my AI representative'}
              </p>
            </div>
          </div>
          <Link href="/explore">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'visitor' ? 'justify-end' : ''}`}
              >
                {message.role === 'twin' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                      {twinSlug.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] ${message.role === 'visitor' ? 'flex flex-col items-end' : ''}`}
                >
                  {message.role === 'twin' && (
                    <p className="text-xs text-muted-foreground mb-1">
                      AI Twin
                    </p>
                  )}
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      message.role === 'visitor'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)] text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {message.role === 'visitor' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                    {twinSlug.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_18%)] rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      AI Twin is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-[hsl(0_0%_18%)] p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Chat with the AI twin..."
                className="min-h-[60px] max-h-[120px] bg-[#0d1117] border-[hsl(0_0%_18%)] text-white placeholder:text-muted-foreground focus:border-primary/50 resize-none"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-black"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}
