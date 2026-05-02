"use client"

import { useEffect, useState } from 'react'

export default function TestEnvPage() {
  const [envVar, setEnvVar] = useState<string | undefined>(undefined)
  
  useEffect(() => {
    setEnvVar(process.env.NEXT_PUBLIC_BACKEND_API_URL)
  }, [])
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
      <p>NEXT_PUBLIC_BACKEND_API_URL: {envVar || 'Not set'}</p>
    </div>
  )
}
