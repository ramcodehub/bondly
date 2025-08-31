import * as React from "react"
import { Icons } from "./icons"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  action: string
  target: string
  targetLink: string
  timestamp: string
  read: boolean
}

const activities: ActivityItem[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "/avatars/01.png",
      initials: "JD",
    },
    action: "created",
    target: "Acme Corp deal",
    targetLink: "/deals/1",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      avatar: "/avatars/02.png",
      initials: "JS",
    },
    action: "updated",
    target: "Q2 sales report",
    targetLink: "/reports/1",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: "3",
    user: {
      name: "Alex Johnson",
      avatar: "",
      initials: "AJ",
    },
    action: "commented",
    target: "on the marketing strategy",
    targetLink: "/discussions/1",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    user: {
      name: "Sarah Williams",
      avatar: "/avatars/03.png",
      initials: "SW",
    },
    action: "completed",
    target: "Onboarding process",
    targetLink: "/tasks/1",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "5",
    user: {
      name: "Michael Brown",
      avatar: "",
      initials: "MB",
    },
    action: "uploaded",
    target: "new contract.pdf",
    targetLink: "/documents/1",
    timestamp: "2 days ago",
    read: true,
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>{activity.user.initials}</AvatarFallback>
            </Avatar>
            {!activity.read && (
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
              </span>
            )}
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}{' '}
              <span className="text-muted-foreground font-normal">
                {activity.action} {activity.target}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.timestamp}
            </p>
          </div>
          <div className="ml-auto">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Icons.moreHorizontal className="h-4 w-4" />
              <span className="sr-only">View activity</span>
            </button>
          </div>
        </div>
      ))}
      <div className="text-center">
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all activity
        </button>
      </div>
    </div>
  )
}
