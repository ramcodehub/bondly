"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function Topbar() {
  const router = useRouter()
  
  // Mock user data - in a real app, this would come from your auth provider
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/01.png",
    initials: "JD"
  }

  // Mock notifications
  const notifications = [
    { id: 1, title: "New message from Sarah", description: "Let's schedule a meeting", time: "2m ago", read: false },
    { id: 2, title: "Deal updated", description: "Acme Corp deal moved to Negotiation", time: "1h ago", read: true },
    { id: 3, title: "Task due soon", description: "Follow up with design team", time: "3h ago", read: true },
  ]
  
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Icons.bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {unreadCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Notifications</p>
              <p className="text-xs leading-none text-muted-foreground">
                {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <DropdownMenuItem 
                    className={`py-2 ${!notification.read ? 'bg-accent' : ''}`}
                    onClick={() => {}}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </React.Fragment>
              ))
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
          <DropdownMenuItem className="cursor-pointer justify-center text-sm font-medium">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push('/settings/profile')}
            >
              <Icons.user className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push('/settings/account')}
            >
              <Icons.settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => {
              // Handle sign out
              router.push('/login')
            }}
          >
            <Icons.logIn className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
