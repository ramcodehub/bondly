import { request } from '@/services/apiService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing API connection...');
    const result = await request('/dashboard/stats');
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    console.error('API Test Error:', err);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}