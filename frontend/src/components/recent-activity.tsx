import * as React from "react"
import { Icons } from "./icons"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { cn } from "@/lib/utils"
import supabase from '@/lib/supabase-client'

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
  type: string
}

export function RecentActivity() {
  const [activities, setActivities] = React.useState<ActivityItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        
        // Fetch recent records from various tables to create activity feed
        const [leadsResult, contactsResult, dealsResult, tasksResult] = await Promise.all([
          supabase
            .from('leads')
            .select('id, name, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('contacts')
            .select('id, first_name, last_name, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('deals')
            .select('id, name, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('tasks')
            .select('id, title, created_at')
            .order('created_at', { ascending: false })
            .limit(5)
        ])

        // Combine and sort all activities
        const allActivities: any[] = []
        
        if (!leadsResult.error && leadsResult.data) {
          leadsResult.data.forEach((lead: any) => {
            allActivities.push({
              id: `lead-${lead.id}`,
              user: {
                name: lead.name,
                avatar: "",
                initials: lead.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
              },
              action: "created",
              target: "new lead",
              targetLink: `/dashboard/leads/${lead.id}`,
              timestamp: formatTimeAgo(lead.created_at),
              read: false,
              type: "lead"
            })
          })
        }
        
        if (!contactsResult.error && contactsResult.data) {
          contactsResult.data.forEach((contact: any) => {
            allActivities.push({
              id: `contact-${contact.id}`,
              user: {
                name: `${contact.first_name} ${contact.last_name}`,
                avatar: "",
                initials: `${contact.first_name[0]}${contact.last_name[0]}`.toUpperCase()
              },
              action: "added",
              target: "new contact",
              targetLink: `/dashboard/contacts/${contact.id}`,
              timestamp: formatTimeAgo(contact.created_at),
              read: false,
              type: "contact"
            })
          })
        }
        
        if (!dealsResult.error && dealsResult.data) {
          dealsResult.data.forEach((deal: any) => {
            allActivities.push({
              id: `deal-${deal.id}`,
              user: {
                name: deal.name,
                avatar: "",
                initials: deal.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
              },
              action: "created",
              target: "new deal",
              targetLink: `/dashboard/deals/${deal.id}`,
              timestamp: formatTimeAgo(deal.created_at),
              read: false,
              type: "deal"
            })
          })
        }
        
        if (!tasksResult.error && tasksResult.data) {
          tasksResult.data.forEach((task: any) => {
            allActivities.push({
              id: `task-${task.id}`,
              user: {
                name: task.title,
                avatar: "",
                initials: task.title.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
              },
              action: "created",
              target: "new task",
              targetLink: `/dashboard/tasks/${task.id}`,
              timestamp: formatTimeAgo(task.created_at),
              read: false,
              type: "task"
            })
          })
        }

        // Sort by timestamp (newest first) and take top 5
        const sortedActivities = allActivities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5)

        setActivities(sortedActivities)
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  // Set up real-time subscriptions
  React.useEffect(() => {
    // Subscribe to leads changes
    const leadsSubscription = supabase
      .channel('leads-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          const newLead = payload.new;
          const newActivity: ActivityItem = {
            id: `lead-${newLead.id}`,
            user: {
              name: newLead.name,
              avatar: "",
              initials: newLead.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
            },
            action: "created",
            target: "new lead",
            targetLink: `/dashboard/leads/${newLead.id}`,
            timestamp: "just now",
            read: false,
            type: "lead"
          };
          
          // Add to activities and keep only top 5
          setActivities(prev => {
            const updated = [newActivity, ...prev].slice(0, 5);
            return updated;
          });
        }
      )
      .subscribe();

    // Subscribe to contacts changes
    const contactsSubscription = supabase
      .channel('contacts-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contacts',
        },
        (payload) => {
          const newContact = payload.new;
          const newActivity: ActivityItem = {
            id: `contact-${newContact.id}`,
            user: {
              name: `${newContact.first_name} ${newContact.last_name}`,
              avatar: "",
              initials: `${newContact.first_name[0]}${newContact.last_name[0]}`.toUpperCase()
            },
            action: "added",
            target: "new contact",
            targetLink: `/dashboard/contacts/${newContact.id}`,
            timestamp: "just now",
            read: false,
            type: "contact"
          };
          
          // Add to activities and keep only top 5
          setActivities(prev => {
            const updated = [newActivity, ...prev].slice(0, 5);
            return updated;
          });
        }
      )
      .subscribe();

    // Subscribe to deals changes
    const dealsSubscription = supabase
      .channel('deals-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deals',
        },
        (payload) => {
          const newDeal = payload.new;
          const newActivity: ActivityItem = {
            id: `deal-${newDeal.id}`,
            user: {
              name: newDeal.name,
              avatar: "",
              initials: newDeal.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
            },
            action: "created",
            target: "new deal",
            targetLink: `/dashboard/deals/${newDeal.id}`,
            timestamp: "just now",
            read: false,
            type: "deal"
          };
          
          // Add to activities and keep only top 5
          setActivities(prev => {
            const updated = [newActivity, ...prev].slice(0, 5);
            return updated;
          });
        }
      )
      .subscribe();

    // Subscribe to tasks changes
    const tasksSubscription = supabase
      .channel('tasks-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          const newTask = payload.new;
          const newActivity: ActivityItem = {
            id: `task-${newTask.id}`,
            user: {
              name: newTask.title,
              avatar: "",
              initials: newTask.title.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
            },
            action: "created",
            target: "new task",
            targetLink: `/dashboard/tasks/${newTask.id}`,
            timestamp: "just now",
            read: false,
            type: "task"
          };
          
          // Add to activities and keep only top 5
          setActivities(prev => {
            const updated = [newActivity, ...prev].slice(0, 5);
            return updated;
          });
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(leadsSubscription);
      supabase.removeChannel(contactsSubscription);
      supabase.removeChannel(dealsSubscription);
      supabase.removeChannel(tasksSubscription);
    };
  }, [])

  // Format timestamp to relative time (e.g., "2 minutes ago")
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="animate-pulse rounded-full bg-muted h-9 w-9" />
            <div className="flex-1 space-y-2">
              <div className="animate-pulse h-4 bg-muted rounded w-3/4" />
              <div className="animate-pulse h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage 
                src={activity.user.avatar || '/default-avatar.png'} 
                alt={activity.user.name} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png'
                }}
              />
              <AvatarFallback>
                <img src="/default-avatar.png" alt="Fallback" className="rounded-full h-full w-full object-cover" />
              </AvatarFallback>
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