'use client'

import { useState, useEffect } from 'react'
import { useRoles } from '@/hooks/useRoles'
import { useUser } from '@/hooks/useUser'

export default function TestSidebarDebug() {
  const { user, profile, loading: userLoading } = useUser()
  const { myRoles, loading: rolesLoading, error } = useRoles()
  const [navigationItems, setNavigationItems] = useState<any[]>([])

  const navigation = [
    {
      title: "Contacts",
      href: "/dashboard/contacts",
      roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Representative", "user"],
      items: [
        {
          title: "Contact Dashboard",
          href: "/dashboard/contacts/dashboard",
          roles: ["Admin", "Marketing Manager", "Sales Manager", "user"]
        },
        {
          title: "View Contacts",
          href: "/dashboard/contacts",
          roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Representative", "user"]
        }
      ],
    },
    {
      title: "Lead Generation",
      href: "/dashboard/leads",
      roles: ["Admin", "Sales Manager", "Sales Representative", "user"],
    },
    {
      title: "Journeys",
      href: "/dashboard/journeys",
      roles: ["Admin", "Marketing Manager", "user"]
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      roles: ["Admin", "Marketing Manager", "Sales Manager", "Marketing Agent", "Sales Representative", "user"]
    },
  ]

  useEffect(() => {
    if (!myRoles) return

    console.log('Debug info:', { user, myRoles, userLoading, rolesLoading, error })

    // Filter navigation based on user roles
    const filtered = navigation.filter(item => {
      // If no roles specified, show to everyone
      if (!item.roles || item.roles.length === 0) return true
      
      // If user has no roles, show basic navigation items
      if (!myRoles || myRoles.length === 0) {
        const basicNavigationItems = ['Contacts', 'Settings']
        return basicNavigationItems.includes(item.title)
      }
      
      // Check if user has the 'user' role (default role)
      const userHasUserRole = myRoles.some((role: any) => role.name === 'user')
      console.log(`Checking item ${item.title}: userHasUserRole=${userHasUserRole}`)
      if (userHasUserRole) {
        // If user has the 'user' role, show all items that include 'user' in their roles
        const shouldShow = item.roles.includes('user')
        console.log(`Item ${item.title} should show for user role: ${shouldShow}`)
        return shouldShow
      }
      
      // For users with specific roles, check if they have any of the required roles
      const userRoleNames = myRoles.map((role: any) => role.name)
      const shouldShow = item.roles.some(role => userRoleNames.includes(role))
      console.log(`Item ${item.title} should show for specific roles: ${shouldShow}`)
      return shouldShow
    })

    console.log('Filtered navigation:', filtered)
    setNavigationItems(filtered)
  }, [user, myRoles, userLoading, rolesLoading, error])

  if (userLoading || rolesLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sidebar Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Info</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify({ user, profile, myRoles, error }, null, 2)}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Navigation Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationItems.map((item, index) => (
            <div key={index} className="border p-3 rounded">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-600">Href: {item.href}</p>
              <p className="text-sm text-gray-600">Roles: {item.roles?.join(', ')}</p>
              {item.items && (
                <div className="mt-2 ml-4">
                  {item.items.map((subItem: any, subIndex: number) => (
                    <div key={subIndex} className="text-sm">
                      <p>→ {subItem.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">All Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigation.map((item, index) => (
            <div key={index} className="border p-3 rounded">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-600">Href: {item.href}</p>
              <p className="text-sm text-gray-600">Roles: {item.roles?.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}