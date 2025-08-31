"use client"

import { useEffect, useState } from "react"

export default function TestEnvPage() {
  const [envInfo, setEnvInfo] = useState<any>(null)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      setEnvInfo({
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        // Note: We can't access the service role key from the client for security reasons
        // This is just to show what we can check from the client
        clientEnv: {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
        }
      })
    }
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Test</h1>
      
      <div className="p-4 bg-white border rounded">
        <h3 className="font-bold mb-2">Environment Information</h3>
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
          {JSON.stringify(envInfo, null, 2)}
        </pre>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">Next Steps</h3>
        <p className="mb-2">To fix the profile update issue, you need to:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Get your Supabase Service Role Key from your Supabase dashboard</li>
          <li>Add it to your <code className="bg-gray-200 px-1 rounded">.env.local</code> file as:</li>
          <pre className="bg-gray-100 p-2 rounded mt-2">SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here</pre>
          <li>Restart your development server</li>
        </ol>
      </div>
    </div>
  )
}