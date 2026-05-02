import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  console.log('Testing cookies...')
  
  // Get all cookies
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  
  console.log('All cookies:', allCookies.map(c => c.name))
  
  // Try to find auth cookies specifically
  const authCookies = allCookies.filter(cookie => 
    cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
  )
  
  console.log('Auth cookies found:', authCookies)
  
  // Also check for the specific cookie names we're looking for
  const specificCookies = [
    'sb-dbetczosnhbfastrtxag-auth-token',
    'sb-dbetczosnhbfastrtxag-auth-token.0',
    'sb-dbetczosnhbfastrtxag-auth-token.1',
    'sb-dbetczosnhbfastrtxag-auth-token.2',
    'sb-dbetczosnhbfastrtxag-auth-token.3',
    'sb-dbetczosnhbfastrtxag-auth-token.4'
  ]
  
  const foundSpecificCookies = specificCookies.map(name => ({
    name,
    value: cookieStore.get(name)?.value ? 'FOUND' : 'NOT FOUND'
  }))
  
  console.log('Specific cookies check:', foundSpecificCookies)
  
  return NextResponse.json({ 
    success: true,
    allCookies: allCookies.map(c => ({ name: c.name, value: c.value ? 'SET' : 'EMPTY' })),
    authCookies: authCookies.map(c => ({ name: c.name, value: 'SET' })),
    specificCookies: foundSpecificCookies
  })
}