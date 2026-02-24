"use client"

import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'

interface PersonProfileProps {
  personId: string
}

export default function PersonProfilePageSimple({ personId }: PersonProfileProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Person Profile {personId}
        </h1>
        <p className="text-muted-foreground mb-6">
          This is a test profile page for person ID: {personId}
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push(`/person/${personId}`)}>
            Start Chat
          </Button>
        </div>
      </div>
    </div>
  )
}