"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, User, CreditCard, Globe, Lock, Mail, Users } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Name</span>
                <span className="font-medium">John Doe</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email</span>
                <span className="font-medium">john@example.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Role</span>
                <Badge variant="secondary">Admin</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>SMS Alerts</span>
                <Badge variant="outline">Disabled</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Set your preferred language and region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Language</span>
                <span className="font-medium">English</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Timezone</span>
                <span className="font-medium">UTC-05:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Date Format</span>
                <span className="font-medium">MM/DD/YYYY</span>
              </div>
              <Button className="w-full" variant="outline">
                Change Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing
            </CardTitle>
            <CardDescription>
              Manage your subscription and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Plan</span>
                <Badge variant="secondary">Professional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Next Billing</span>
                <span className="font-medium">Jun 15, 2023</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Method</span>
                <span className="font-medium">Visa **** 4242</span>
              </div>
              <Button className="w-full" variant="outline">
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Password</span>
                <span className="font-medium">Last changed 2 months ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Two-Factor Auth</span>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Sessions</span>
                <span className="font-medium">3</span>
              </div>
              <Button className="w-full" variant="outline">
                Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Integration
            </CardTitle>
            <CardDescription>
              Connect your email accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Gmail</span>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Outlook</span>
                <Badge variant="outline">Not Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Other IMAP</span>
                <Badge variant="outline">Not Connected</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Manage Accounts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Role Management Card - Only visible to Admins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role Management
            </CardTitle>
            <CardDescription>
              Manage user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Roles</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Users</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Role Assignments</span>
                <span className="font-medium">15</span>
              </div>
              <Link href="/dashboard/settings/roles">
                <Button className="w-full">
                  Manage Roles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}