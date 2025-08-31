import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function NotificationsPage() {
  // Mock notification preferences
  const notificationPreferences = [
    {
      category: 'Account',
      items: [
        {
          id: 'account-activity',
          label: 'Account activity',
          description: 'Important notifications about your account',
          email: true,
          inApp: true,
          push: true
        },
        {
          id: 'security',
          label: 'Security alerts',
          description: 'Important security notifications about your account',
          email: true,
          inApp: true,
          push: true
        }
      ]
    },
    {
      category: 'Team',
      items: [
        {
          id: 'team-invites',
          label: 'Team invitations',
          description: 'When you receive a team invitation',
          email: true,
          inApp: true,
          push: false
        },
        {
          id: 'team-updates',
          label: 'Team updates',
          description: 'Important updates from your team',
          email: true,
          inApp: true,
          push: false
        }
      ]
    },
    {
      category: 'Deals',
      items: [
        {
          id: 'deal-updates',
          label: 'Deal updates',
          description: 'Updates on your deals and opportunities',
          email: true,
          inApp: true,
          push: true
        },
        {
          id: 'deal-activity',
          label: 'Deal activity',
          description: 'Activity on deals you follow',
          email: false,
          inApp: true,
          push: false
        }
      ]
    },
    {
      category: 'Tasks',
      items: [
        {
          id: 'task-assigned',
          label: 'Assigned tasks',
          description: 'When you are assigned a new task',
          email: true,
          inApp: true,
          push: true
        },
        {
          id: 'task-updates',
          label: 'Task updates',
          description: 'Updates on tasks you are following',
          email: false,
          inApp: true,
          push: false
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notifications</h2>
        <p className="text-muted-foreground">
          Configure how you receive notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose what email notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {notificationPreferences.map((prefGroup) => (
              <div key={prefGroup.category} className="space-y-4">
                <h3 className="font-medium">{prefGroup.category}</h3>
                <div className="space-y-4">
                  {prefGroup.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor={`${item.id}-email`} className="font-normal">
                          {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={`${item.id}-email`}
                        defaultChecked={item.email}
                        className="ml-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>
            Control which notifications you see within the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {notificationPreferences.map((prefGroup) => (
              <div key={prefGroup.category} className="space-y-4">
                <h3 className="font-medium">{prefGroup.category}</h3>
                <div className="space-y-4">
                  {prefGroup.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor={`${item.id}-inapp`} className="font-normal">
                          {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={`${item.id}-inapp`}
                        defaultChecked={item.inApp}
                        className="ml-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Configure push notifications on your devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {notificationPreferences.map((prefGroup) => (
              <div key={prefGroup.category} className="space-y-4">
                <h3 className="font-medium">{prefGroup.category}</h3>
                <div className="space-y-4">
                  {prefGroup.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor={`${item.id}-push`} className="font-normal">
                          {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={`${item.id}-push`}
                        defaultChecked={item.push}
                        className="ml-4"
                        disabled={!item.push} // Disable switch if push is not supported for this item
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
