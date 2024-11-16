'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export default function LoadingScreen() {
  const router = useRouter()

  useEffect(() => {
    // Simulate a delay before navigating to the dashboard
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 3000) // 3 seconds delay

    // Clean up the timer
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[300px]">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="mt-4 text-lg font-semibold text-center">Loading your dashboard...</p>
          <p className="mt-2 text-sm text-muted-foreground text-center">Please wait while we prepare your experience.</p>
        </CardContent>
      </Card>
    </div>
  )
}