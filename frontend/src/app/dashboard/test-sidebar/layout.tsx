"use client"

import { AppSidebar } from "../../../components/app-sidebar"

export default function TestSidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar - always visible for testing */}
      <div className="block fixed top-0 left-0 h-screen w-64 z-50 bg-background border-r">
        <AppSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}