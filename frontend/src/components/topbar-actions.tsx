"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Bell, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NotificationsList = dynamic(() => import("./topbar-notifications").then(m => m.NotificationsList).catch(() => ({ default: () => null })), { ssr: false })
const CommandPalette = dynamic(() => import("./command-palette").then(m => m.CommandPalette).catch(() => ({ default: () => null })), { ssr: false, loading: () => null })

export default function TopbarActions() {
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

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" aria-label="Profile">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
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