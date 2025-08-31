"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { ChevronLeft, Menu } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: keyof typeof Icons
  label?: string
  items?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "layoutDashboard",
  },
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: "users",
    label: "contacts",
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: "building2",
    label: "companies",
  },
  {
    title: "Leads",
    href: "/dashboard/leads",
    icon: "fileText",
    label: "leads",
  },
  {
    title: "Deals",
    href: "/dashboard/deals",
    icon: "handshake",
    label: "deals",
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: "checkSquare",
    label: "tasks",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
]

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onClose?: () => void
}

export const AppSidebar = React.memo(function AppSidebar({ className, isOpen = true, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const sidebarClasses = cn(
    "relative h-screen border-r transition-all duration-300 ease-in-out",
    isCollapsed ? "w-16" : "w-64",
    className
  )

  return (
    <div className={sidebarClasses}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            {!isCollapsed && <span className="font-bold">CRM</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={toggleSidebar}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-2">
            {navigation.map((item) => {
              const Icon = Icons[item.icon]
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    isCollapsed ? "justify-center" : ""
                  )}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <span className="ml-2">{item.title}</span>
                  )}
                  {!isCollapsed && item.label && (
                    <span className="ml-auto text-xs">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        {/* Profile footer */}
        <div className="mt-auto border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-accent/50",
                isCollapsed ? "justify-center" : ""
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">User Name</p>
                    <p className="truncate text-xs text-muted-foreground">user@example.com</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/settings/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/settings/notifications")}>Notifications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/settings/account")}>Account settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => (window.location.href = "/login")}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
})

export const MobileSidebar = React.memo(function MobileSidebar() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 px-0">
        <div className="h-full">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold">CRM</span>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <nav className="space-y-1 p-2">
              {navigation.map((item) => {
                const Icon = Icons[item.icon]
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="ml-2">{item.title}</span>
                    {item.label && (
                      <span className="ml-auto text-xs">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
})
