"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { supabase } from "@/lib/supabase-client"

export default function AccountPage() {
  const [subscription, setSubscription] = useState({
    plan: "Pro",
    status: "active",
    nextBillingDate: "2023-12-31",
    users: 5,
    storage: "50 GB",
    price: "$29.99",
    billingCycle: "monthly"
  })
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data: sub } = await supabase.from('subscriptions').select('*').limit(1).maybeSingle()
      if (mounted && sub) setSubscription(sub)
      const { data: methods } = await supabase.from('payment_methods').select('*').order('id', { ascending: false })
      if (mounted && methods) setPaymentMethods(methods)
      const { data: inv } = await supabase.from('invoices').select('*').order('date', { ascending: false })
      if (mounted && inv) setInvoices(inv)
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your subscription, billing, and payment information
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                You are currently on the <span className="font-medium">{subscription.plan}</span> plan.
              </CardDescription>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Status</p>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm capitalize">{subscription.status}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Next Billing Date</p>
            <p className="text-sm">
              {new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Billing Cycle</p>
            <p className="text-sm capitalize">{subscription.billingCycle}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and billing details</CardDescription>
            </div>
            <Button variant="outline">
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-16 rounded-md bg-muted flex items-center justify-center">
                    <Icons.creditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{method.type} •••• {method.last4}</p>
                    <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Default
                    </span>
                  )}
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium">Invoice #{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-medium">{invoice.amount}</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    invoice.status === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Icons.download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Cancel Subscription</h4>
                <p className="text-sm text-muted-foreground">
                  Your subscription will remain active until the end of your current billing period.
                </p>
              </div>
              <Button variant="destructive">Cancel Subscription</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
