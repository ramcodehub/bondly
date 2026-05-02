'use client';

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { ScrollArea } from "./ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Icons } from "./icons"
import { ChevronLeft, ChevronDown, Menu, Users, LineChart, Map, Calendar, Megaphone, PieChart, Book, Settings } from "lucide-react"
import { useUser } from "../hooks/useUser"
import { useRoles } from "../hooks/useRoles"
import { usePermission } from "../hooks/usePermission"
import { useRoleStore } from "../lib/stores/roleStore"
import { UserRoleBadge } from "../app/dashboard/settings/roles/UserRoleBadge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

interface NavItem {
  title: string
  href: string
  icon?: keyof typeof Icons | React.ComponentType<any>
  label?: string
  items?: NavItem[]
  roles?: string[] // Legacy role-based check
  permission?: string // 🛡️ NEW: Permission-based check
}

const navigation: NavItem[] = [
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: Users,
    roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Rep"],
    items: [
      {
        title: "Contact Dashboard",
        href: "/dashboard/contacts/dashboard",
        roles: ["Admin", "Marketing Manager", "Sales Manager"]
      },
      {
        title: "View Contacts",
        href: "/dashboard/contacts",
        roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Rep"]
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
    roles: ["Admin", "Sales Manager", "Sales Rep"],
    permission: "deals.read",
    items: [
      {
        title: "Leads",
        href: "/dashboard/leads",
        roles: ["Admin", "Sales Manager", "Sales Rep"],
        permission: "deals.read"
      },
      {
        title: "Deals",
        href: "/dashboard/deals",
        roles: ["Admin", "Sales Manager", "Sales Rep"],
        permission: "deals.read"
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
        roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Rep"]
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
    roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Rep"],
    permission: "dashboard.view"
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
  const { user, profile, loading: userLoading } = useUser()
  const { myRoles, isAdmin, isMarketingManager, isSalesManager, hasRole, loading: rolesLoading } = useRoles()
  const { can } = usePermission() 

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  React.useEffect(() => {
    const root = document.documentElement;
    if (isCollapsed) {
      root.style.setProperty('--sidebar-width', '4rem'); 
    } else {
      root.style.setProperty('--sidebar-width', '16rem'); 
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

  const roles = React.useMemo(() => {
    return Array.isArray(myRoles) 
      ? myRoles.map(r => (typeof r === 'string' ? r.toLowerCase() : r?.name?.toLowerCase() || '')) 
      : [];
  }, [myRoles]);

  const canAccess = React.useCallback((item: NavItem) => {
    if (item.permission && can(item.permission)) return true;
    if (!item.roles || item.roles.length === 0) return true;
    const filteredAllowed = item.roles.filter(r => r.toLowerCase() !== 'user');
    return filteredAllowed.some(role => roles.includes(role.toLowerCase()));
  }, [roles, can]);

  const filteredNavigation = React.useMemo(() => {
    if (!user || userLoading || rolesLoading) return [];
    return navigation.filter(item => {
      return canAccess(item);
    }).map(item => {
      if (item.items) {
        const filteredItems = item.items.filter(child => canAccess(child));
        if (filteredItems.length > 0 || !item.items) {
          return { ...item, items: filteredItems };
        }
        return null;
      }
      return item;
    }).filter(Boolean);
  }, [user, userLoading, rolesLoading, canAccess]);

  React.useEffect(() => {
    console.log('Sidebar debug info:', { 
      user, 
      profile, 
      loading: userLoading,
      myRoles,
      rolesLoading,
      isAdmin,
      isMarketingManager,
      isSalesManager,
      filteredNavigation: filteredNavigation.length,
      totalNavigation: navigation.length
    })
  }, [user, profile, userLoading, myRoles, rolesLoading, isAdmin, isMarketingManager, isSalesManager, filteredNavigation.length])

  const isLoading = userLoading || rolesLoading;
  const isAuthorized = !!user;

  const sidebarClasses = cn(
    "h-screen border-r transition-all duration-300 ease-in-out z-50 flex flex-col bg-background",
    isCollapsed ? "w-16" : "w-64",
    className
  )

  // Get user display name and email
  const userDisplayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  return (
    <div className={sidebarClasses}>
      {isLoading ? (
        <div className="flex-1 flex flex-col">
          <div className="flex h-16 items-center border-b px-4">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
            {!isCollapsed && <div className="ml-2 h-4 w-16 bg-gray-200 rounded animate-pulse" />}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      ) : !isAuthorized ? (
        <>
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
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <nav className="flex-1 overflow-y-auto py-2 px-2">
              <div className="space-y-1">
                {navigation.filter(item => {
                  const basicNavigationItems = ['Contacts', 'Settings'];
                  return basicNavigationItems.includes(item.title);
                }).map((item) => {
                  const Icon = item.icon ? (typeof item.icon === 'string' ? Icons[item.icon as keyof typeof Icons] : item.icon) : null;
                  const isActive = pathname === item.href;
                  const hasChildren = item.items && item.items.length > 0;
                  
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
                          {!isCollapsed && <ChevronDown className={cn("h-4 w-4 transition-transform", openGroups[item.title] ? "rotate-180" : "")} />}
                        </CollapsibleTrigger>
                        {!isCollapsed && (
                          <CollapsibleContent className="space-y-1 pl-4">
                            {item.items?.map((child) => {
                              const isChildActive = pathname === child.href;
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
                              );
                            })}
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    );
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
                  );
                })}
              </div>
            </nav>
          </div>
          
          <div className="border-t p-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                <img src="/default-avatar.png" alt="User" className="h-full w-full object-cover" />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium">User</p>
                  <p className="text-xs text-muted-foreground">Not authenticated</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
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
                  // Skip null items
                  if (!item) return null;
                  
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
                          {!isCollapsed && <ChevronDown className={cn("h-4 w-4 transition-transform", openGroups[item.title] ? "rotate-180" : "")} />}
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
                    <AvatarImage 
                      src={profile?.avatar_url || user?.user_metadata?.avatar_url || '/default-avatar.png'} 
                      alt={userDisplayName} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.png'
                      }}
                    />
                    <AvatarFallback>
                      <img src="/default-avatar.png" alt="Fallback" className="rounded-full h-full w-full object-cover" />
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{userDisplayName}</p>
                      {userEmail && (
                        <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                      )}
                      {/* Show roles when not collapsed */}
                      {!isCollapsed && myRoles && myRoles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {myRoles.slice(0, 2).map((role: any) => (
                            <UserRoleBadge key={role.id} role={role.name} />
                          ))}
                          {myRoles.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{myRoles.length - 2} more</span>
                          )}
                        </div>
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
        </>
      )}
    </div>
  )
})

const MobileSidebar = React.memo(function MobileSidebar() {
  const [open, setOpen] = React.useState(false)
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({})
  const pathname = usePathname()
  const { user, profile, loading: userLoading } = useUser()
  const { myRoles = [], loading: rolesLoading } = useRoleStore()
  const { can } = usePermission()

  // 🚀 Task 1: Normalize roles (Fix 5: Defensive Fallback)
  const safeRoles = myRoles || [];
  const roles = React.useMemo(() => {
    return Array.isArray(safeRoles) 
      ? safeRoles.map(r => (typeof r === 'string' ? r.toLowerCase() : r?.name?.toLowerCase() || '')) 
      : [];
  }, [safeRoles]);

  // 🚀 Task 2: Create canAccess helper (Enhanced with Permissions)
  const canAccess = React.useCallback((item: NavItem) => {
    // 1. Permission check (High priority)
    if (item.permission && can(item.permission)) return true;

    // 2. Legacy Role check
    if (!item.roles || item.roles.length === 0) return true;
    const filteredAllowed = item.roles.filter(r => r.toLowerCase() !== 'user');
    return filteredAllowed.some(role => roles.includes(role.toLowerCase()));
  }, [roles, can]);

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

  // 🚀 Task 3 & 4: Filter navigation based on user roles + permissions
  const filteredNavigation = React.useMemo(() => {
    if (!user || userLoading || rolesLoading) return [];
    return navigation.filter(item => {
      return canAccess(item);
    }).map(item => {
      if (item.items) {
        const filteredItems = item.items.filter(child => canAccess(child));
        if (filteredItems.length > 0 || !item.items) {
          return { ...item, items: filteredItems };
        }
        return null;
      }
      return item;
    }).filter(Boolean);
  }, [user, userLoading, rolesLoading, canAccess]);

  // Derived flags
  const showSidebar = user && !userLoading && !rolesLoading;

  // Get user display name and email
  const userDisplayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  // Close sidebar function
  const closeSidebar = () => {
    setOpen(false)
  }

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <>
      {showSidebar ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Icons.logo className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 px-0 bg-background">
            <div className="h-full flex flex-col">
              <div className="flex h-16 items-center border-b px-4">
                <Link href="/dashboard" className="flex items-center space-x-2" onClick={closeSidebar}>
                  <Icons.logo className="h-6 w-6" />
                  <span className="font-bold">Bondly</span>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto">
                <nav className="space-y-1 p-2">
                  {filteredNavigation.map((item) => {
                    const Icon = item.icon ? (typeof item.icon === 'string' ? Icons[item.icon as keyof typeof Icons] : item.icon) : null;
                    const isActive = pathname === item.href
                    const hasChildren = item.items && item.items.length > 0
                    
                    if (hasChildren) {
                      return (
                        <div key={item.title}>
                          <Collapsible
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
                                    onClick={closeSidebar}
                                  >
                                    <span>{child.title}</span>
                                  </Link>
                                )
                              })}
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
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
                        onClick={closeSidebar}
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
              </div>
              {/* Profile footer for mobile */}
              <div className="border-t p-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-accent/50">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={profile?.avatar_url || user?.user_metadata?.avatar_url || '/default-avatar.png'} 
                          alt={userDisplayName} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/default-avatar.png'
                          }}
                        />
                        <AvatarFallback>
                          <img src="/default-avatar.png" alt="Fallback" className="rounded-full h-full w-full object-cover" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{userDisplayName}</p>
                        {userEmail && (
                          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                        )}
                        {/* Role badges for mobile */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {/* Fix 2: Safe Access */}
                          {(myRoles ?? []).length > 0 ? (
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
                    <DropdownMenuItem onClick={() => {
                      closeSidebar()
                      window.location.href = "/dashboard/settings/profile"
                    }}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      closeSidebar()
                      window.location.href = "/dashboard/settings/notifications"
                    }}>Notifications</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      closeSidebar()
                      window.location.href = "/dashboard/settings/account"
                    }}>Account settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      closeSidebar()
                      window.location.href = "/login"
                    }}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </>
  )
})

// Export both components
export { AppSidebar, MobileSidebar }