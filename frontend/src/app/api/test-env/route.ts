import { NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function GET() {
  // Log environment variables (without exposing secrets)
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Environment Variables Check:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', hasSupabaseUrl ? 'SET' : 'MISSING');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', hasAnonKey ? 'SET' : 'MISSING');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', hasServiceRoleKey ? 'SET' : 'MISSING');
  
  // Return the status
  return NextResponse.json({ 
    success: true,
    envVars: {
      NEXT_PUBLIC_SUPABASE_URL: hasSupabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnonKey,
      SUPABASE_SERVICE_ROLE_KEY: hasServiceRoleKey
    }
  });
}