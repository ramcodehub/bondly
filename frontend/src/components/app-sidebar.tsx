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
import { ChevronLeft, ChevronDown, Menu, Users, LineChart, Map, Calendar, Megaphone, PieChart, Book, Settings } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavItem {
  title: string
  href: string
  icon?: keyof typeof Icons | React.ComponentType<any>
  label?: string
  items?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: Users,
    items: [
      {
        title: "Contact Dashboard",
        href: "/dashboard/contacts/dashboard",
      },
      {
        title: "View Contacts",
        href: "/dashboard/contacts",
      },
      {
        title: "Lists",
        href: "/dashboard/contacts/lists",
      },
      {
        title: "Segments",
        href: "/dashboard/contacts/segments",
      },
      {
        title: "Topics",
        href: "/dashboard/contacts/topics",
      },
      {
        title: "Lead Qualification",
        href: "/dashboard/contacts/qualification",
      },
    ],
  },
  {
    title: "Lead Generation",
    href: "/dashboard/leads",
    icon: LineChart,
    items: [
      {
        title: "Leads",
        href: "/dashboard/leads",
      },
      {
        title: "Deals",
        href: "/dashboard/deals",
      },
    ],
  },
  {
    title: "Journeys",
    href: "/dashboard/journeys",
    icon: Map,
  },
  {
    title: "Marketing Planner",
    href: "/dashboard/planner",
    icon: Calendar,
    items: [
      {
        title: "Tasks",
        href: "/dashboard/tasks",
      },
      {
        title: "Calendar",
        href: "/dashboard/planner",
      },
    ],
  },
  {
    title: "Marketing Campaigns",
    href: "/dashboard/campaigns",
    icon: Megaphone,
    items: [
      {
        title: "Campaign Dashboard",
        href: "/dashboard/campaigns",
      },
      {
        title: "Campaign Reports",
        href: "/dashboard/campaigns/reports",
      },
    ],
  },
  {
    title: "Website Analytics",
    href: "/dashboard/analytics",
    icon: PieChart,
  },
  {
    title: "Library",
    href: "/dashboard/library",
    icon: Book,
    items: [
      {
        title: "Templates",
        href: "/dashboard/library/templates",
      },
      {
        title: "Chat Review",
        href: "/dashboard/chat/review",
      },
      {
        title: "Resources",
        href: "/dashboard/library/resources",
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onClose?: () => void
}

export const AppSidebar = React.memo(function AppSidebar({ className, isOpen = true, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({})
  const { user, profile, loading } = useUser()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Update CSS variables when sidebar state changes
  React.useEffect(() => {
    const root = document.documentElement;
    if (isCollapsed) {
      root.style.setProperty('--sidebar-width', '4rem'); // 64px
    } else {
      root.style.setProperty('--sidebar-width', '16rem'); // 256px
    }
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  // Auto-expand groups based on current route
  React.useEffect(() => {
    const activeGroup = navigation.find(group => 
      group.items?.some(item => pathname?.startsWith(item.href))
    )
    
    if (activeGroup) {
      setOpenGroups(prev => ({
        ...prev,
        [activeGroup.title]: true
      }))
    }
  }, [pathname])

  const sidebarClasses = cn(
    "h-screen border-r transition-all duration-300 ease-in-out z-50 flex flex-col",
    isCollapsed ? "w-16" : "w-64",
    className
  )

  // Get user display name and email
  const userDisplayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  // Debug logging to help identify issues
  React.useEffect(() => {
    console.log('Sidebar user data:', { user, profile, loading })
  }, [user, profile, loading])

  return (
    <div className={sidebarClasses}>
      <div className="flex h-16 items-center border-b px-4 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          {!isCollapsed && <span className="font-bold">Bondly</span>}
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
      
      {/* Navigation area that takes remaining space */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon ? (typeof item.icon === 'string' ? Icons[item.icon as keyof typeof Icons] : item.icon) : null;
              const isActive = pathname === item.href
              const hasChildren = item.items && item.items.length > 0
              
              if (hasChildren) {
                return (
                  <Collapsible
                    key={item.title}
                    open={openGroups[item.title] || false}
                    onOpenChange={() => toggleGroup(item.title)}
                  >
                    <CollapsibleTrigger className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                      isCollapsed ? "justify-center" : "justify-between"
                    )}>
                      <div className="flex items-center">
                        {Icon && <Icon className="h-5 w-5" />}
                        {!isCollapsed && (
                          <span className={Icon ? "ml-2" : ""}>{item.title}</span>
                        )}
                      </div>
                      {!isCollapsed && <div />}
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                      <CollapsibleContent className="space-y-1 pl-4">
                        {item.items?.map((child) => {
                          const isChildActive = pathname === child.href
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isChildActive
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                              )}
                              onClick={onClose}
                            >
                              <span>{child.title}</span>
                            </Link>
                          )
                        })}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                )
              }
              
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
                  {Icon && <Icon className="h-5 w-5" />}
                  {!isCollapsed && (
                    <span className={Icon ? "ml-2" : ""}>{item.title}</span>
                  )}
                  {!isCollapsed && item.label && (
                    <span className="ml-auto text-xs">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
      
      {/* Profile footer - fixed at bottom */}
      <div className="border-t p-3 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-accent/50",
              isCollapsed ? "justify-center" : ""
            )}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userDisplayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{userDisplayName}</p>
                  {userEmail && (
                    <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                  )}
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
  )
})

export const MobileSidebar = React.memo(function MobileSidebar() {
  const [open, setOpen] = React.useState(false)
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({})
  const pathname = usePathname()
  const { user, profile, loading } = useUser()

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  // Auto-expand groups based on current route
  React.useEffect(() => {
    const activeGroup = navigation.find(group => 
      group.items?.some(item => pathname?.startsWith(item.href))
    )
    
    if (activeGroup) {
      setOpenGroups(prev => ({
        ...prev,
        [activeGroup.title]: true
      }))
    }
  }, [pathname])

  // Get user display name and email
  const userDisplayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  // Debug logging to help identify issues
  React.useEffect(() => {
    console.log('Mobile sidebar user data:', { user, profile, loading })
  }, [user, profile, loading])

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
              <span className="font-bold">Bondly</span>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <nav className="space-y-1 p-2">
              {navigation.map((item) => {
                const Icon = item.icon ? (typeof item.icon === 'string' ? Icons[item.icon as keyof typeof Icons] : item.icon) : null;
                const isActive = pathname === item.href
                const hasChildren = item.items && item.items.length > 0
                
                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.title}
                      open={openGroups[item.title] || false}
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <CollapsibleTrigger className={cn(
                        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                        "justify-between"
                      )}>
                        <div className="flex items-center">
                          {Icon && <Icon className="h-5 w-5" />}
                          <span className={Icon ? "ml-2" : ""}>{item.title}</span>
                        </div>
                        <div />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 pl-4">
                        {item.items?.map((child) => {
                          const isChildActive = pathname === child.href
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isChildActive
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                              )}
                              onClick={() => setOpen(false)}
                            >
                              <span>{child.title}</span>
                            </Link>
                          )
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  )
                }
                
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
                    {Icon && <Icon className="h-5 w-5" />}
                    <span className={Icon ? "ml-2" : ""}>{item.title}</span>
                    {item.label && (
                      <span className="ml-auto text-xs">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </nav>
            {/* Profile footer for mobile */}
            <div className="mt-auto border-t p-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-accent/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userDisplayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{userDisplayName}</p>
                      {userEmail && (
                        <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                      )}
                    </div>
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
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
})