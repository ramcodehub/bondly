"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import realtimeManager, { RealtimeStatus } from "@/lib/realtime";
import { useDealsRealtime } from "@/lib/hooks/useDealsRealtime";
import { useTasksRealtime } from "@/lib/hooks/useTasksRealtime";
import { useLeadsRealtime } from "@/lib/hooks/useLeadsRealtime";
import { useContactsRealtime } from "@/lib/hooks/useContactsRealtime";
import ProtectedRoute from "@/components/auth/protected-route";
const USE_MOCK = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
import { 
  Building2, 
  Users, 
  CheckSquare, 
  TrendingUp,
  Database,
  CheckCircle,
  AlertCircle,
  Activity,
  DollarSign,
  Calendar,
  Target,
  Phone,
  Mail,
  Plus,
  Eye
} from "lucide-react";
import Link from "next/link";
import { DealsStageChart } from "./components/deals-stage-chart";
import { TasksPriorityChart } from "./components/tasks-priority-chart";
import { ContactsGrowthChart } from "./components/contacts-growth-chart";
import { DealModal } from "./components/deal-modal";
import { TaskModal } from "./components/task-modal";
import { ContactModal } from "./components/contact-modal";
import { MetricTooltip } from "./components/metric-tooltip";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  // Use realtime hooks for live data
  const { 
    deals, 
    stats: dealStats, 
    loading: dealsLoading,
    createDeal
  } = useDealsRealtime();
  
  const { 
    tasks, 
    stats: taskStats, 
    loading: tasksLoading,
    createTask
  } = useTasksRealtime();
  
  const { 
    leads, 
    stats: leadStats, 
    loading: leadsLoading,
    createLead
  } = useLeadsRealtime();
  
  const { 
    contacts, 
    stats: contactStats, 
    loading: contactsLoading,
    createContact: createContactHook
  } = useContactsRealtime();
  
  // Real-time data subscriptions with error handling
  const [realtimeError, setRealtimeError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('connected');
  const [stats, setStats] = useState({
    companies: 0,
    contacts: 0,
    leadsCount: 0
  });
  
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setDbStatus('checking');
      
      // Fetch basic stats (companies, contacts, leads) from backend
      const statsResponse = await fetch('http://localhost:5000/api/homepage/stats').catch(() => null);
      
      if (statsResponse?.ok) {
        const statsData = await statsResponse.json();
        setStats({
          companies: statsData.totalAccounts || 0,
          contacts: statsData.totalContacts || 0,
          leadsCount: statsData.totalLeads || 0
        });
        setDbStatus('connected');
      }
      
      // Mock recent activities
      setRecentActivities([
        {
          id: 1,
          type: 'deal',
          title: 'New deal created',
          description: 'Acme Corp - $50,000',
          time: '2 minutes ago',
          icon: DollarSign
        },
        {
          id: 2,
          type: 'task',
          title: 'Task completed',
          description: 'Follow up with lead',
          time: '5 minutes ago', 
          icon: CheckCircle
        },
        {
          id: 3,
          type: 'contact',
          title: 'New contact added',
          description: 'John Smith from Tech Inc',
          time: '10 minutes ago',
          icon: Users
        }
      ]);
      
      if (!statsResponse?.ok && USE_MOCK) {
        console.warn('API unavailable, using mock data');
        setDbStatus('connected');
        setStats({ 
          companies: 12, 
          contacts: 87, 
          leadsCount: 45
        });
      } else if (!statsResponse?.ok) {
        setDbStatus('error');
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      if (USE_MOCK) {
        console.warn('Database error, using mock data');
        setDbStatus('connected');
        setStats({ 
          companies: 12, 
          contacts: 87,
          leadsCount: 45
        });
      } else {
        setDbStatus('error');
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle creating a new deal from the modal
  const handleCreateDeal = async (dealData: any) => {
    try {
      await createDeal(dealData);
    } catch (error) {
      console.error('Error creating deal:', error);
    }
  }

  // Handle creating a new task from the modal
  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  // Handle creating a new contact from the modal
  const handleCreateContact = async () => {
    // Refresh stats to show updated contact count
    fetchAllData();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your CRM dashboard. Here's a real-time overview of your business.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {realtimeError ? (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
              Realtime Unavailable
            </div>
          ) : (
            <RealtimeStatus />
          )}
          {(loading || dealsLoading || tasksLoading || leadsLoading || contactsLoading) && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Loading...
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MetricTooltip
              title="Revenue Overview"
              description="Total value from active deals"
              details={[
                { label: "Active Deals", value: dealStats.totalDeals },
                { label: "Average Deal Value", value: dealStats.totalDeals > 0 ? `$${Math.round(dealStats.totalValue / dealStats.totalDeals).toLocaleString()}` : "$0" },
                { label: "Highest Deal", value: dealStats.recentDeals.length > 0 ? `$${Math.max(...dealStats.recentDeals.map(d => d.amount || 0)).toLocaleString()}` : "$0" }
              ]}
              linkHref="/dashboard/deals"
              linkText="View Deals"
              detailedData={deals.map(deal => ({
                name: deal.name,
                amount: `$${deal.amount.toLocaleString()}`,
                company: deal.company,
                stage: deal.stage.replace('_', ' ').toUpperCase()
              }))}
              dataColumns={[
                { key: "name", label: "Deal Name" },
                { key: "amount", label: "Amount" },
                { key: "company", label: "Company" },
                { key: "stage", label: "Stage" }
              ]}
            >
              <div className="text-2xl font-bold">${dealStats.totalValue.toLocaleString()}</div>
            </MetricTooltip>
            <p className="text-xs text-muted-foreground">
              From {dealStats.totalDeals} active deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MetricTooltip
              title="Leads Overview"
              description="Potential customers in your pipeline"
              details={[
                { label: "New This Week", value: "2" },
                { label: "Converted", value: "1" },
                { label: "Pending", value: leadStats.totalLeads - 1 }
              ]}
              linkHref="/dashboard/leads"
              linkText="View Leads"
              detailedData={leads.map(lead => ({
                name: `${lead.first_name} ${lead.last_name}`,
                email: lead.email,
                company: lead.company || 'N/A',
                status: lead.status?.toUpperCase() || 'UNKNOWN'
              }))}
              dataColumns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "company", label: "Company" },
                { key: "status", label: "Status" }
              ]}
            >
              <div className="text-2xl font-bold">{leadStats.totalLeads}</div>
            </MetricTooltip>
            <p className="text-xs text-muted-foreground">
              Potential customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MetricTooltip
              title="Tasks Overview"
              description="Your current task workload"
              details={[
                { label: "To Do", value: taskStats.statusBreakdown.todo || 0 },
                { label: "In Progress", value: taskStats.statusBreakdown.in_progress || 0 },
                { label: "Completed", value: taskStats.completedTasks },
                { label: "Urgent", value: taskStats.urgentTasks }
              ]}
              linkHref="/dashboard/tasks"
              linkText="View Tasks"
              detailedData={tasks.map(task => ({
                title: task.title,
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
                priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
                status: task.status.replace('_', ' ').toUpperCase()
              }))}
              dataColumns={[
                { key: "title", label: "Task" },
                { key: "dueDate", label: "Due Date" },
                { key: "priority", label: "Priority" },
                { key: "status", label: "Status" }
              ]}
            >
              <div className="text-2xl font-bold">{taskStats.pendingTasks}</div>
            </MetricTooltip>
            <p className="text-xs text-muted-foreground">
              {taskStats.urgentTasks} urgent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MetricTooltip
              title="Contacts Overview"
              description="Your customer network"
              details={[
                { label: "Companies", value: contactStats.companiesCount },
                { label: "New This Month", value: "3" },
                { label: "Active", value: contactStats.totalContacts }
              ]}
              linkHref="/dashboard/contacts"
              linkText="View Contacts"
              detailedData={contacts.map(contact => ({
                name: contact.name,
                email: contact.email,
                phone: contact.phone || 'N/A',
                company: contact.company_name || 'N/A',
                status: contact.status?.toUpperCase() || 'UNKNOWN'
              }))}
              dataColumns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "company", label: "Company" },
                { key: "status", label: "Status" }
              ]}
            >
              <div className="text-2xl font-bold">{contactStats.totalContacts}</div>
            </MetricTooltip>
            <p className="text-xs text-muted-foreground">
              From {contactStats.companiesCount} companies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MetricTooltip
              title="Companies Overview"
              description="Organizations in your network"
              details={[
                { label: "New This Month", value: "2" },
                { label: "With Active Deals", value: dealStats.totalDeals },
                { label: "With Open Tasks", value: taskStats.totalTasks }
              ]}
              linkHref="/dashboard/companies"
              linkText="View Companies"
              detailedData={[]}
              dataColumns={[]}
            >
              <div className="text-2xl font-bold">{contactStats.companiesCount}</div>
            </MetricTooltip>
            <p className="text-xs text-muted-foreground">
              Total organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MetricTooltip
              title="Deals Pipeline"
              description="Your sales opportunities"
              details={[
                { label: "Lead Stage", value: dealStats.stageBreakdown.lead?.count || 0 },
                { label: "Qualified", value: dealStats.stageBreakdown.qualified?.count || 0 },
                { label: "Proposal", value: dealStats.stageBreakdown.proposal?.count || 0 },
                { label: "Negotiation", value: dealStats.stageBreakdown.negotiation?.count || 0 }
              ]}
              linkHref="/dashboard/deals"
              linkText="View Deals"
              detailedData={deals.map(deal => ({
                name: deal.name,
                amount: `$${deal.amount.toLocaleString()}`,
                company: deal.company,
                stage: deal.stage.replace('_', ' ').toUpperCase()
              }))}
              dataColumns={[
                { key: "name", label: "Deal Name" },
                { key: "amount", label: "Amount" },
                { key: "company", label: "Company" },
                { key: "stage", label: "Stage" }
              ]}
            >
              <div className="text-2xl font-bold">{dealStats.totalDeals}</div>
            </MetricTooltip>
            <p className="text-xs text-muted-foreground">
              In sales pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MetricTooltip
              title="Urgent Tasks"
              description="Tasks requiring immediate attention"
              details={[
                { label: "High Priority", value: taskStats.priorityBreakdown.high || 0 },
                { label: "Urgent Priority", value: taskStats.priorityBreakdown.urgent || 0 },
                { label: "Overdue", value: taskStats.overdueTasks.length }
              ]}
              linkHref="/dashboard/tasks?priority=urgent"
              linkText="View Urgent Tasks"
              detailedData={tasks.filter(task => task.priority === 'urgent' || task.priority === 'high').map(task => ({
                title: task.title,
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
                priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
                status: task.status.replace('_', ' ').toUpperCase()
              }))}
              dataColumns={[
                { key: "title", label: "Task" },
                { key: "dueDate", label: "Due Date" },
                { key: "priority", label: "Priority" },
                { key: "status", label: "Status" }
              ]}
            >
              <div className="text-2xl font-bold">{taskStats.urgentTasks}</div>
            </MetricTooltip>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MetricTooltip
              title="Completed Tasks"
              description="Tasks finished this period"
              details={[
                { label: "This Week", value: "5" },
                { label: "This Month", value: "22" },
                { label: "Total", value: taskStats.completedTasks }
              ]}
              linkHref="/dashboard/tasks?status=done"
              linkText="View Completed"
              detailedData={tasks.filter(task => task.status === 'done').map(task => ({
                title: task.title,
                completedDate: task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : 'N/A',
                priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
              }))}
              dataColumns={[
                { key: "title", label: "Task" },
                { key: "completedDate", label: "Completed Date" },
                { key: "priority", label: "Priority" }
              ]}
            >
              <div className="text-2xl font-bold">{taskStats.completedTasks}</div>
            </MetricTooltip>
            <p className="text-xs text-muted-foreground">
              Tasks finished
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Views */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No recent activities</p>
            )}
          </CardContent>
        </Card>

        {/* Top Deals */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Top Deals
            </CardTitle>
            <Link href="/dashboard/deals">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {dealStats.recentDeals.length > 0 ? (
              dealStats.recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{deal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {deal.company || 'No company'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-medium">
                      ${deal.amount?.toLocaleString() || '0'}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {deal.stage}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">No deals yet</p>
                <Link href="/dashboard/deals">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Deal
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Urgent Tasks
            </CardTitle>
            <Link href="/dashboard/tasks">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {taskStats.recentTasks.filter(task => task.priority === 'urgent').length > 0 ? (
              taskStats.recentTasks.filter(task => task.priority === 'urgent').slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge 
                      variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}
                      className="text-xs mb-1"
                    >
                      {task.priority}
                    </Badge>
                    {task.dueDate && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">No urgent tasks</p>
                <Link href="/dashboard/tasks">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Deals Charts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Deals Overview
            </CardTitle>
            <div className="flex gap-2">
              <DealModal onCreateDeal={handleCreateDeal} />
              <Link href="/dashboard/deals">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <DealsStageChart deals={deals} stats={dealStats} />
          </CardContent>
        </Card>

        {/* Tasks Charts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks Overview
            </CardTitle>
            <div className="flex gap-2">
              <TaskModal onCreateTask={handleCreateTask} />
              <Link href="/dashboard/tasks">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <TasksPriorityChart tasks={tasks} stats={taskStats} />
          </CardContent>
        </Card>

        {/* Contacts Charts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contacts Overview
            </CardTitle>
            <div className="flex gap-2">
              <ContactModal onCreateContact={handleCreateContact} />
              <Link href="/dashboard/contacts">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <ContactsGrowthChart contactsData={[]} stats={stats} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/leads">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <Target className="h-5 w-5" />
                <span className="text-sm">Add Lead</span>
              </Button>
            </Link>
            <Link href="/dashboard/deals">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm">Create Deal</span>
              </Button>
            </Link>
            <Link href="/dashboard/tasks">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <CheckSquare className="h-5 w-5" />
                <span className="text-sm">New Task</span>
              </Button>
            </Link>
            <Link href="/dashboard/contacts">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Add Contact</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}