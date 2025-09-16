"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Bell, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/hooks/useUser"
import { useRoles } from "@/hooks/useRoles"
import { UserRoleBadge } from "@/app/dashboard/settings/roles/UserRoleBadge"
import { ThemeToggle } from "@/components/theme-toggle"

const NotificationsList = dynamic(() => import("./topbar-notifications").then(m => m.NotificationsList).catch(() => ({ default: () => null })), { ssr: false })
const CommandPalette = dynamic(() => import("./command-palette").then(m => m.CommandPalette).catch(() => ({ default: () => null })), { ssr: false, loading: () => null })

export default function TopbarActions() {
  const { user, profile } = useUser()
  const { myRoles } = useRoles()
  
  // Get user display name
  const userDisplayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Command Palette trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9"
        aria-label="Command Palette"
        title="Search (Ctrl/⌘+K)"
        onClick={() => {
          // Simulate Ctrl+K to open existing palette logic
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true } as any))
        }}
      >
        <Search className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      {/* Mount palette only when user triggers via keyboard or click (defer initial hydration) */}
      {false && <CommandPalette />}
      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" aria-label="Notifications">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 sm:w-72 p-0">
          <DropdownMenuLabel className="px-3 py-2 sm:px-4 sm:py-2">Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-64 sm:max-h-80 overflow-auto">
            <NotificationsList />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" aria-label="Profile">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 text-sm font-medium">
            {userDisplayName}
          </div>
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            {user?.email}
          </div>
          {/* Role badges */}
          <div className="px-2 py-1.5 flex flex-wrap gap-1">
            {myRoles && myRoles.length > 0 ? (
              myRoles.map((role) => (
                <UserRoleBadge key={role.id} role={role.name} />
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No roles assigned</span>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/settings/profile")}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/settings/notifications")}>Notifications</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => (window.location.href = "/login")}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}