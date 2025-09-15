"use client";

import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';

export default function TestSidebar() {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    console.log('TestSidebar component mounted');
    // Force show the sidebar for testing
    setShowSidebar(true);
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r">
        {showSidebar && <AppSidebar />}
      </div>
      <div className="flex-1 p-6">
        <h1>Test Sidebar Page</h1>
        <p>This page is for testing the sidebar visibility.</p>
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Toggle Sidebar
        </button>
      </div>
    </div>
  );
}