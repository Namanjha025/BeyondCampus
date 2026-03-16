'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UniversityDetailSkeleton() {
  return (
    <div className="flex h-screen bg-background animate-pulse">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-border/30 bg-background/50 backdrop-blur">
          <Button variant="ghost" size="icon" disabled className="opacity-50">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-gray-800/50" />

            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-800/50 rounded-md w-1/3" />
              <div className="h-4 bg-gray-800/30 rounded-md w-1/4" />
            </div>

            <div className="w-32 h-10 bg-gray-800/50 rounded-md" />
          </div>
        </div>

        {/* University Stats Banner */}
        <div className="bg-secondary/30 border-b border-border/30 px-6 py-4">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center space-y-2">
              <div className="h-4 bg-gray-800/40 rounded-md w-24 mx-auto" />
              <div className="h-4 bg-gray-800/20 rounded-md w-16 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <div className="h-4 bg-gray-800/40 rounded-md w-24 mx-auto" />
              <div className="h-4 bg-gray-800/20 rounded-md w-16 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <div className="h-4 bg-gray-800/40 rounded-md w-24 mx-auto" />
              <div className="h-4 bg-gray-800/20 rounded-md w-16 mx-auto" />
            </div>
          </div>
        </div>

        {/* Welcome State Skeleton */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="max-w-2xl w-full text-center -mt-20 space-y-8">
            <div className="space-y-4">
              <div className="h-20 w-20 rounded-full bg-gray-800/30 mx-auto" />
              <div className="h-10 bg-gray-800/40 rounded-lg w-3/4 mx-auto" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-secondary/50 border border-border/30 rounded-xl" />
              <div className="h-24 bg-secondary/50 border border-border/30 rounded-xl" />
            </div>

            <div className="h-[100px] bg-secondary/50 border-2 border-border/30 rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
