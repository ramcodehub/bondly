const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
  try {
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`API error at ${endpoint}:`, error);
    // Return safe empty structure or handle via caller fallback
    return { success: false, isFallback: true, data: [] };
  }
}

// Helper functions for common HTTP methods
export async function get(endpoint: string) {
  return apiCall(endpoint, { method: 'GET' });
}

export async function post(endpoint: string, data: any) {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function put(endpoint: string, data: any) {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function del(endpoint: string) {
  return apiCall(endpoint, { method: 'DELETE' });
}