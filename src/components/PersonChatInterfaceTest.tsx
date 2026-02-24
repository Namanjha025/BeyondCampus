"use client"

import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'

interface PersonChatInterfaceTestProps {
  personId: string
}

export default function PersonChatInterfaceTest({ personId }: PersonChatInterfaceTestProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Person Chat Test - ID: {personId}
        </h1>
        <div className="flex gap-4">
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push(`/person-profile/${personId}`)}>
            View Profile
          </Button>
        </div>
      </div>
    </div>
  )
}