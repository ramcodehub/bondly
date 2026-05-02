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
import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabase-client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// Define types
interface User {
  id: string
  name: string
  email: string
  avatar_url: string
  initials: string
}

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

export function Topbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data and notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch user profile
        const userResponse = await fetch('/api/user/profile')
        const userResult = await userResponse.json()
        
        if (userResult.success) {
          setUser(userResult.data)
        } else {
          throw new Error(userResult.message || 'Failed to fetch user profile')
        }
        
        // Fetch notifications
        const notificationsResponse = await fetch('/api/user/notifications')
        const notificationsResult = await notificationsResponse.json()
        
        if (notificationsResult.success) {
          setNotifications(notificationsResult.data)
        } else {
          throw new Error(notificationsResult.message || 'Failed to fetch notifications')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Set up real-time subscription for notifications
  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          // Add new notification to the list
          const newNotification = payload.new as Notification
          setNotifications((prev) => [newNotification, ...prev])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
        },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          // Update existing notification
          const updatedNotification = payload.new as Notification
          setNotifications((prev) =>
            prev.map((notification) =>
              notification.id === updatedNotification.id
                ? updatedNotification
                : notification
            )
          )
        }
      )
      .subscribe()

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  // Handle marking notification as read
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ))
      } else {
        console.error('Failed to mark notification as read:', result.message)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        Error loading data
      </div>
    )
  }

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
                    onClick={() => markAsRead(notification.id)}
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
              <AvatarImage 
                src={user?.avatar_url || '/default-avatar.png'} 
                alt={user?.name} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png'
                }}
              />
              <AvatarFallback>
                <img src="/default-avatar.png" alt="Fallback" className="rounded-full h-full w-full object-cover" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
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