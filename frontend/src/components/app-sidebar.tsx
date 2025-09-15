'use client';

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
import { useRoles } from "@/hooks/useRoles"
import { UserRoleBadge } from "@/app/dashboard/settings/roles/UserRoleBadge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavItem {
  title: string
  href: string
  icon?: keyof typeof Icons | React.ComponentType<any>
  label?: string
  items?: NavItem[]
  roles?: string[] // Roles that can see this item
}

const navigation: NavItem[] = [
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: Users,
    roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Representative"],
    items: [
      {
        title: "Contact Dashboard",
        href: "/dashboard/contacts/dashboard",
        roles: ["Admin", "Marketing Manager", "Sales Manager"]
      },
      {
        title: "View Contacts",
        href: "/dashboard/contacts",
        roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Representative"]
      },
      {
        title: "Lists",
        href: "/dashboard/contacts/lists",
        roles: ["Admin", "Marketing Manager"]
      },
      {
        title: "Segments",
        href: "/dashboard/contacts/segments",
        roles: ["Admin", "Marketing Manager"]
      },
      {
        title: "Topics",
        href: "/dashboard/contacts/topics",
        roles: ["Admin", "Marketing Manager"]
      },
      {
        title: "Lead Qualification",
        href: "/dashboard/contacts/qualification",
        roles: ["Admin", "Marketing Manager", "Sales Manager"]
      },
    ],
  },
  {
    title: "Lead Generation",
    href: "/dashboard/leads",
    icon: LineChart,
    roles: ["Admin", "Sales Manager", "Sales Representative"],
    items: [
      {
        title: "Leads",
        href: "/dashboard/leads",
        roles: ["Admin", "Sales Manager", "Sales Representative"]
      },
      {
        title: "Deals",
        href: "/dashboard/deals",
        roles: ["Admin", "Sales Manager", "Sales Representative"]
      },
    ],
  },
  {
    title: "Journeys",
    href: "/dashboard/journeys",
    icon: Map,
    roles: ["Admin", "Marketing Manager"]
  },
  {
    title: "Marketing Planner",
    href: "/dashboard/planner",
    icon: Calendar,
    roles: ["Admin", "Marketing Manager"],
    items: [
      {
        title: "Tasks",
        href: "/dashboard/tasks",
        roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Representative"]
      },
      {
        title: "Calendar",
        href: "/dashboard/planner",
        roles: ["Admin", "Marketing Manager"]
      },
    ],
  },
  {
    title: "Marketing Campaigns",
    href: "/dashboard/campaigns",
    icon: Megaphone,
    roles: ["Admin", "Marketing Manager", "Marketing Agent"],
    items: [
      {
        title: "Campaign Dashboard",
        href: "/dashboard/campaigns",
        roles: ["Admin", "Marketing Manager"]
      },
      {
        title: "Campaign Reports",
        href: "/dashboard/campaigns/reports",
        roles: ["Admin", "Marketing Manager"]
      },
    ],
  },
  {
    title: "Website Analytics",
    href: "/dashboard/analytics",
    icon: PieChart,
    roles: ["Admin", "Marketing Manager"]
  },
  {
    title: "Library",
    href: "/dashboard/library",
    icon: Book,
    roles: ["Admin", "Marketing Manager", "Sales Manager"],
    items: [
      {
        title: "Templates",
        href: "/dashboard/library/templates",
        roles: ["Admin", "Marketing Manager"]
      },
      {
        title: "Chat Review",
        href: "/dashboard/chat/review",
        roles: ["Admin", "Marketing Manager", "Sales Manager"]
      },
      {
        title: "Resources",
        href: "/dashboard/library/resources",
        roles: ["Admin", "Marketing Manager", "Sales Manager"]
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Representative"]
  },
]

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onClose?: () => void
}

const AppSidebar = React.memo(function AppSidebar({ className, isOpen = true, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({})
  const { user, profile, loading } = useUser()
  const { myRoles, isAdmin, isMarketingManager, isSalesManager, hasRole, loading: rolesLoading } = useRoles()

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

  // Filter navigation based on user roles
  const filteredNavigation = navigation.filter(item => {
    // If no roles specified, show to everyone
    if (!item.roles || item.roles.length === 0) return true;
    
    // Check if user has any of the required roles
    return item.roles.some(role => hasRole(role));
  }).map(item => {
    // Also filter child items
    if (item.items) {
      return {
        ...item,
        items: item.items.filter(child => {
          // If no roles specified, show to everyone
          if (!child.roles || child.roles.length === 0) return true;
          
          // Check if user has any of the required roles
          return child.roles.some(role => hasRole(role));
        })
      };
    }
    return item;
  });

  // Debug logging to help identify issues
  React.useEffect(() => {
    console.log('Sidebar debug info:', { 
      user, 
      profile, 
      loading,
      myRoles,
      rolesLoading,
      isAdmin,
      isMarketingManager,
      isSalesManager,
      filteredNavigation: filteredNavigation.length,
      totalNavigation: navigation.length
    })
  }, [user, profile, loading, myRoles, rolesLoading, isAdmin, isMarketingManager, isSalesManager, filteredNavigation.length])

  const sidebarClasses = cn(
    "h-screen border-r transition-all duration-300 ease-in-out z-50 flex flex-col",
    isCollapsed ? "w-16" : "w-64",
    className
  )

  // Get user display name and email
  const userDisplayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  // Show loading state
  if (loading || rolesLoading) {
    return (
      <div className={sidebarClasses}>
        <div className="flex h-16 items-center border-b px-4">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          {!isCollapsed && <div className="ml-2 h-4 w-16 bg-gray-200 rounded animate-pulse" />}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Show error state if user is not available
  if (!user) {
    return (
      <div className={sidebarClasses}>
        <div className="flex h-16 items-center border-b px-4">
          <div className="h-6 w-6 bg-gray-200 rounded" />
          {!isCollapsed && <span className="ml-2 font-bold">Bondly</span>}
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Not authenticated</p>
          </div>
        </div>
      </div>
    );
  }

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
            {filteredNavigation.map((item) => {
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

const MobileSidebar = React.memo(function MobileSidebar() {
  const [open, setOpen] = React.useState(false)
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({})
  const pathname = usePathname()
  const { user, profile, loading } = useUser()
  const { myRoles, isAdmin, isMarketingManager, isSalesManager, hasRole, loading: rolesLoading } = useRoles()

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

  // Filter navigation based on user roles
  const filteredNavigation = navigation.filter(item => {
    // If no roles specified, show to everyone
    if (!item.roles || item.roles.length === 0) return true;
    
    // Check if user has any of the required roles
    return item.roles.some(role => hasRole(role));
  }).map(item => {
    // Also filter child items
    if (item.items) {
      return {
        ...item,
        items: item.items.filter(child => {
          // If no roles specified, show to everyone
          if (!child.roles || child.roles.length === 0) return true;
          
          // Check if user has any of the required roles
          return child.roles.some(role => hasRole(role));
        })
      };
    }
    return item;
  });

  // Debug logging to help identify issues
  React.useEffect(() => {
    console.log('Mobile sidebar debug info:', { 
      user, 
      profile, 
      loading,
      myRoles,
      rolesLoading,
      isAdmin,
      isMarketingManager,
      isSalesManager,
      filteredNavigation: filteredNavigation.length,
      totalNavigation: navigation.length
    })
  }, [user, profile, loading, myRoles, rolesLoading, isAdmin, isMarketingManager, isSalesManager, filteredNavigation.length])

  // Get user display name and email
  const userDisplayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  // Show loading state
  if (loading || rolesLoading) {
    return (
      <div className="md:hidden">
        <Button variant="ghost" size="icon" className="md:hidden">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
        </Button>
      </div>
    );
  }

  // Show error state if user is not available
  if (!user) {
    return (
      <div className="md:hidden">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    );
  }

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
              {filteredNavigation.map((item) => {
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
                      {/* Role badges for mobile */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {myRoles && myRoles.length > 0 ? (
                          myRoles.map((role) => (
                            <UserRoleBadge key={role.id} role={role.name} />
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No roles</span>
                        )}
                      </div>
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

// Export both components
export { AppSidebar, MobileSidebar }