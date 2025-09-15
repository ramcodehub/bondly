"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRoles } from '@/hooks/useRoles'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isAdmin } = useRoles()
  
  const settingsNav = [
    {
      name: 'Profile',
      href: '/dashboard/settings/profile',
      icon: 'user',
    },
    {
      name: 'Account',
      href: '/dashboard/settings/account',
      icon: 'settings',
    },
    {
      name: 'Team',
      href: '/dashboard/settings/team',
      icon: 'users',
    },
    {
      name: 'Notifications',
      href: '/dashboard/settings/notifications',
      icon: 'bell',
    },
  ]

  // Only show Roles tab to Admin users
  const adminNav = [
    {
      name: 'Roles',
      href: '/dashboard/settings/roles',
      icon: 'shield',
    },
  ]

  const allNavItems = isAdmin ? [...settingsNav, ...adminNav] : settingsNav

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            {allNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground',
                    'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}