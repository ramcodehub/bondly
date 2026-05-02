import { request } from '@/services/apiService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing API connection...');
    const result = await request('/dashboard/stats');
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Test Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}