"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DealsStageChart } from "../components/deals-stage-chart"
import { TasksPriorityChart } from "../components/tasks-priority-chart"
import { ContactsGrowthChart } from "../components/contacts-growth-chart"
import { Deal } from "../deals/types"
import { Task } from "../tasks/types"

interface Contact {
  id: string
  name: string
  email: string
  company_name: string
  status: string
}

export default function ChartTestPage() {
  const [testData, setTestData] = useState({
    deals: [] as Deal[],
    tasks: [] as Task[],
    contacts: [] as Contact[],
    dealStats: {
      totalDeals: 0,
      totalValue: 0,
      stageBreakdown: {},
      recentDeals: [] as Deal[]
    },
    taskStats: {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      urgentTasks: 0,
      priorityBreakdown: {},
      statusBreakdown: {},
      recentTasks: [] as Task[],
      overdueTasks: [] as Task[]
    },
    contactStats: {
      totalContacts: 0,
      statusBreakdown: {},
      recentContacts: [] as Contact[],
      companiesCount: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create mock data for testing
    const mockDeals: Deal[] = [
      { 
        id: '1', 
        name: 'Deal 1', 
        amount: 10000, 
        stage: 'lead', 
        company: 'Company A', 
        probability: 10,
        closeDate: '2023-12-31'
      },
      { 
        id: '2', 
        name: 'Deal 2', 
        amount: 25000, 
        stage: 'qualified', 
        company: 'Company B', 
        probability: 30,
        closeDate: '2023-12-31'
      },
      { 
        id: '3', 
        name: 'Deal 3', 
        amount: 50000, 
        stage: 'proposal', 
        company: 'Company C', 
        probability: 50,
        closeDate: '2023-12-31'
      },
      { 
        id: '4', 
        name: 'Deal 4', 
        amount: 75000, 
        stage: 'negotiation', 
        company: 'Company D', 
        probability: 80,
        closeDate: '2023-12-31'
      },
      { 
        id: '5', 
        name: 'Deal 5', 
        amount: 100000, 
        stage: 'closed_won', 
        company: 'Company E', 
        probability: 100,
        closeDate: '2023-12-31'
      }
    ]

    const mockTasks: Task[] = [
      { 
        id: '1', 
        title: 'Task 1', 
        description: 'Description for task 1',
        dueDate: '2023-12-31',
        priority: 'low', 
        status: 'todo', 
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        labels: [],
        assignedTo: []
      },
      { 
        id: '2', 
        title: 'Task 2', 
        description: 'Description for task 2',
        dueDate: '2023-12-31',
        priority: 'medium', 
        status: 'in_progress', 
        createdAt: '2023-02-01',
        updatedAt: '2023-02-01',
        labels: [],
        assignedTo: []
      },
      { 
        id: '3', 
        title: 'Task 3', 
        description: 'Description for task 3',
        dueDate: '2023-12-31',
        priority: 'high', 
        status: 'done', 
        createdAt: '2023-03-01',
        updatedAt: '2023-03-01',
        labels: [],
        assignedTo: []
      },
      { 
        id: '4', 
        title: 'Task 4', 
        description: 'Description for task 4',
        dueDate: '2023-12-31',
        priority: 'urgent', 
        status: 'todo', 
        createdAt: '2023-04-01',
        updatedAt: '2023-04-01',
        labels: [],
        assignedTo: []
      }
    ]

    const mockContacts: Contact[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', company_name: 'Company A', status: 'active' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', company_name: 'Company B', status: 'active' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', company_name: 'Company C', status: 'lead' }
    ]

    const mockDealStats = {
      totalDeals: 5,
      totalValue: 260000,
      stageBreakdown: {
        lead: { count: 1, value: 10000 },
        qualified: { count: 1, value: 25000 },
        proposal: { count: 1, value: 50000 },
        negotiation: { count: 1, value: 75000 },
        closed_won: { count: 1, value: 100000 },
        closed_lost: { count: 0, value: 0 }
      },
      recentDeals: mockDeals
    }

    const mockTaskStats = {
      totalTasks: 4,
      completedTasks: 1,
      pendingTasks: 3,
      urgentTasks: 1,
      priorityBreakdown: {
        low: 1,
        medium: 1,
        high: 1,
        urgent: 1
      },
      statusBreakdown: {
        todo: 2,
        in_progress: 1,
        done: 1,
        cancelled: 0
      },
      recentTasks: mockTasks,
      overdueTasks: []
    }

    const mockContactStats = {
      totalContacts: 3,
      statusBreakdown: {
        active: 2,
        lead: 1
      },
      recentContacts: mockContacts,
      companiesCount: 3
    }

    setTestData({
      deals: mockDeals,
      tasks: mockTasks,
      contacts: mockContacts,
      dealStats: mockDealStats,
      taskStats: mockTaskStats,
      contactStats: mockContactStats
    })
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Chart Components Test</h1>
        <p className="text-muted-foreground">
          Testing the chart components with mock data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deals Stage Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <DealsStageChart deals={testData.deals} stats={testData.dealStats} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks Priority Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <TasksPriorityChart tasks={testData.tasks} stats={testData.taskStats} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacts Growth Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ContactsGrowthChart contactsData={testData.contacts} stats={testData.contactStats} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}