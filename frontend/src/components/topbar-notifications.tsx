"use client"

import * as React from "react"

type NotificationItem = {
  id: string
  title: string
  description?: string
  time: string
}

const demoItems: NotificationItem[] = [
  { id: "1", title: "Welcome to the Bondly!", description: "Explore the dashboard and features.", time: "Just now" },
  { id: "2", title: "New lead assigned", description: "Acme Corp - John Doe", time: "5m" },
  { id: "3", title: "Deal updated", description: "Proposal sent for Globex", time: "1h" },
]

export function NotificationsList() {
  const [items] = React.useState<NotificationItem[]>(demoItems)
  return (
    <ul className="divide-y">
      {items.length === 0 ? (
        <li className="px-4 py-6 text-sm text-muted-foreground">No notifications</li>
      ) : (
        items.map((n) => (
          <li key={n.id} className="px-4 py-3">
            <p className="text-sm font-medium">{n.title}</p>
            {n.description && <p className="text-sm text-muted-foreground">{n.description}</p>}
            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
          </li>
        ))
      )}
    </ul>
  )
}


