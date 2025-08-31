import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar, MobileSidebar } from "@/components/app-sidebar"
import TopbarActions from "@/components/topbar-actions"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="md:hidden">
              <MobileSidebar />
            </div>
            <div className="ml-auto">
              <TopbarActions />
            </div>
          </div>
          <main className="flex-1 overflow-y-auto bg-background p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
