"use client"

import { AppSidebar } from "@/components/app-sidebar"
import TopbarActions from "@/components/topbar-actions"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen relative">
      {/* Desktop Sidebar - fixed position */}
      <div className="hidden md:block md:w-64 fixed h-screen top-0 left-0 z-50 bg-background">
        <AppSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="md:hidden block">
            <button className="p-2 rounded-md border">
              Mobile Menu (Hidden in this test)
            </button>
          </div>
          <div className="ml-auto">
            <TopbarActions />
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}