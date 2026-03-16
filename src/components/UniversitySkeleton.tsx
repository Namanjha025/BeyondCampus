"use client"

import { cn } from '@/lib/utils'

export function UniversitySkeleton() {
  return (
    <div
      className="group relative bg-[#0f0f0f] rounded-2xl border border-gray-800/20 overflow-hidden flex shrink-0 animate-pulse"
      style={{ width: '480px', height: '160px' }}
    >
      <div className="w-[130px] h-[150px] shrink-0 p-3">
        <div className="w-full h-full rounded-xl bg-gray-800/50" />
      </div>
      <div className="flex-1 pl-4 pr-5 py-6 flex flex-col justify-center">
        <div className="flex-1">
          <div className="h-6 bg-gray-800/50 rounded-md w-3/4 mb-3" />
          <div className="h-4 bg-gray-800/30 rounded-md w-1/2 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-800/20 rounded-md w-full" />
            <div className="h-3 bg-gray-800/20 rounded-md w-5/6" />
          </div>
        </div>
      </div>
    </div>
  )
}
