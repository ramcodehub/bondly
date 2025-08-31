"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ErrorBoundary from "@/components/error-boundary"

interface ClientLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function ClientLayout({ children, className = "" }: ClientLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // Remove the initializeStores call since it's not needed with the new store structure
    // The stores will be initialized when first used
    
    // Removed automatic redirect to dashboard to allow landing page to be the entry point
  }, [router])

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
  )
}