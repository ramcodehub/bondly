"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"

export default function ReportsPage() {
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [activeDeals, setActiveDeals] = useState<number>(0)
  const [tasksTotal, setTasksTotal] = useState<number>(0)
  const [tasksDone, setTasksDone] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Revenue from closed won deals
        const { data: revData, error: revErr } = await supabase
          .from('deals')
          .select('amount')
          .eq('stage', 'closed_won')
        
        if (revErr) {
          console.error('Error fetching revenue:', revErr)
        }
        
        const revenue = !revErr && revData ? revData.reduce((s: number, r: any) => s + Number(r.amount || 0), 0) : 0

        // Active/open deals (exclude closed)
        const { count: openCount, error: openErr } = await supabase
          .from('deals')
          .select('*', { count: 'exact', head: true })
          .not('stage', 'in', '(closed_won,closed_lost)')
        
        if (openErr) {
          console.error('Error fetching active deals:', openErr)
        }

        // Tasks counts
        const { count: totalTasks, error: totalErr } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
        
        if (totalErr) {
          console.error('Error fetching total tasks:', totalErr)
        }
        
        const { count: doneTasks, error: doneErr } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'done')
        
        if (doneErr) {
          console.error('Error fetching done tasks:', doneErr)
        }

        if (!mounted) return
        
        setTotalRevenue(revenue)
        setActiveDeals(openCount || 0)
        setTasksTotal(totalTasks || 0)
        setTasksDone(doneTasks || 0)
        setLoading(false)
      } catch (error) {
        console.error('Error in reports:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          View and analyze your business performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading…' : 'Sum of closed won deals'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Status</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals} Active Deals</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading…' : 'Excludes closed won/lost'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksTotal} Tasks</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading…' : `${tasksDone} completed, ${Math.max(0, tasksTotal - tasksDone)} pending`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Revenue chart (coming soon)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm">JD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      John Doe
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Updated deal #DEAL-{item}00{5 - item}
                    </p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">
                    {item}h ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
