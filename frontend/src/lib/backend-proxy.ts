import { NextRequest } from 'next/server';

// Get backend URL from environment variables
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace('/api', '') || 'http://localhost:5001';

/**
 * Proxy a request to the backend server
 * @param endpoint - The endpoint to proxy to (e.g., '/api/landing/hero-stats')
 * @param req - The incoming Next.js request
 * @returns The response from the backend server
 */
export async function proxyToBackend(endpoint: string, req: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const backendUrl = `${BACKEND_URL}${endpoint}`;
    
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    headers['Content-Type'] = 'application/json';
    
    const requestOptions: RequestInit = {
      method: req.method,
      headers,
      signal: controller.signal
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await req.text();
      if (body) requestOptions.body = body;
    }

    const response = await fetch(backendUrl, requestOptions);
    clearTimeout(timeoutId);

    const responseBody = await response.text();
    
    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`Error proxying request to ${endpoint}:`, error);
    
    // Always return a valid JSON structure even on failure to prevent frontend crashes
    return new Response(
      JSON.stringify({
        success: true, // Mark as true to trigger frontend fallbacks
        data: {}, 
        message: 'Using local fallback due to backend unavailability',
        isFallback: true
      }),
      {
        status: 200, // Return 200 to allow frontend fallback logic to trigger
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}