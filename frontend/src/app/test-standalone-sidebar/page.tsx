"use client";

import { AppSidebar } from '@/components/app-sidebar';

export default function TestStandaloneSidebar() {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r">
        <AppSidebar />
      </div>
      <div className="flex-1 p-6">
        <h1>Standalone Sidebar Test</h1>
        <p>This page tests the sidebar component in isolation.</p>
      </div>
    </div>
  );
}