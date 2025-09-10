"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import realtimeManager, { RealtimeStatus } from "@/lib/realtime";
import { useDealsRealtime } from "@/lib/hooks/useDealsRealtime";
import { useTasksRealtime } from "@/lib/hooks/useTasksRealtime";
import { useLeadsRealtime } from "@/lib/hooks/useLeadsRealtime";
import { useCompaniesRealtime } from "@/lib/hooks/useCompaniesRealtime";
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
import { LeadsSourceChart } from "./components/leads-source-chart";
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
  
  const { 
    companies, 
    stats: companyStats, 
    loading: companiesLoading,
    createCompany
  } = useCompaniesRealtime();

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
      
      // Use the realtime hooks data instead of API calls
      // The hooks already fetch the data and provide realtime updates
      
      // Update stats based on the realtime data
      setStats({
        companies: companyStats.totalCompanies || 0,
        contacts: contactStats.totalContacts || 0,
        leadsCount: leadStats.totalLeads || 0
      });
      
      setDbStatus('connected');
      
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Welcome to your Bondly. Here's a real-time overview of your business.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {realtimeError ? (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-600">
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
              Realtime Unavailable
            </div>
          ) : (
            <RealtimeStatus />
          )}
          {(loading || dealsLoading || tasksLoading || leadsLoading || contactsLoading) && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Loading...
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid - Responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTooltip 
          title="Total Revenue" 
          description={`$${dealStats.totalValue.toLocaleString()}`}
          linkHref="/dashboard/deals"
          linkText="View Deals"
          detailedData={deals}
          dataColumns={[
            { key: 'name', label: 'Deal Name' },
            { key: 'amount', label: 'Amount' },
            { key: 'company', label: 'Company' },
            { key: 'stage', label: 'Stage' }
          ]}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dealStats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
        </MetricTooltip>
        
        <MetricTooltip 
          title="Leads" 
          description={leadStats.totalLeads.toString()}
          linkHref="/dashboard/leads"
          linkText="View Leads"
          detailedData={leads}
          dataColumns={[
            { key: 'first_name', label: 'First Name' },
            { key: 'last_name', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status' }
          ]}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadStats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">+18.1% from last month</p>
            </CardContent>
          </Card>
        </MetricTooltip>
        
        <MetricTooltip 
          title="Active Tasks" 
          description={taskStats.pendingTasks.toString()}
          linkHref="/dashboard/tasks"
          linkText="View Tasks"
          detailedData={tasks}
          dataColumns={[
            { key: 'title', label: 'Task Title' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'priority', label: 'Priority' },
            { key: 'status', label: 'Status' }
          ]}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">+4 since last hour</p>
            </CardContent>
          </Card>
        </MetricTooltip>
        
        <MetricTooltip 
          title="Contacts" 
          description={contactStats.totalContacts.toString()}
          linkHref="/dashboard/contacts"
          linkText="View Contacts"
          detailedData={contacts}
          dataColumns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'company_name', label: 'Company' }
          ]}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactStats.totalContacts}</div>
              <p className="text-xs text-muted-foreground">+8 since yesterday</p>
            </CardContent>
          </Card>
        </MetricTooltip>
      </div>

      {/* Charts Section - Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DealsStageChart deals={deals} stats={dealStats} />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <TasksPriorityChart tasks={tasks} stats={taskStats} />
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics - Responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTooltip 
          title="Companies" 
          description={companyStats.totalCompanies.toString()}
          linkHref="/dashboard/companies"
          linkText="View Companies"
          detailedData={companies}
          dataColumns={[
            { key: 'name', label: 'Company Name' },
            { key: 'industry', label: 'Industry' },
            { key: 'size', label: 'Size' },
            { key: 'website', label: 'Website' }
          ]}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyStats.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">+3 since last week</p>
            </CardContent>
          </Card>
        </MetricTooltip>
        
        <MetricTooltip 
          title="Urgent Tasks" 
          description={taskStats.urgentTasks.toString()}
          linkHref="/dashboard/tasks"
          linkText="View Tasks"
          detailedData={tasks.filter(task => task.priority === 'urgent')}
          dataColumns={[
            { key: 'title', label: 'Task Title' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'status', label: 'Status' }
          ]}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.urgentTasks}</div>
              <p className="text-xs text-muted-foreground">+2 in last 24 hours</p>
            </CardContent>
          </Card>
        </MetricTooltip>
        
        <MetricTooltip 
          title="Completed Tasks" 
          description={taskStats.completedTasks.toString()}
          linkHref="/dashboard/tasks"
          linkText="View Tasks"
          detailedData={tasks.filter(task => task.status === 'done')}
          dataColumns={[
            { key: 'title', label: 'Task Title' },
            { key: 'completed_at', label: 'Completed At' }
          ]}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.completedTasks}</div>
              <p className="text-xs text-muted-foreground">+15 from yesterday</p>
            </CardContent>
          </Card>
        </MetricTooltip>
        
        <MetricTooltip 
          title="Recent Contacts" 
          description={contactStats.recentContacts.length.toString()}
          linkHref="/dashboard/contacts"
          linkText="View Contacts"
          detailedData={contactStats.recentContacts}
          dataColumns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'company_name', label: 'Company' }
          ]}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Contacts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactStats.recentContacts.length}</div>
              <p className="text-xs text-muted-foreground">Latest additions</p>
            </CardContent>
          </Card>
        </MetricTooltip>
      </div>

      {/* Quick Actions - Responsive layout */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/dashboard/leads">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <Target className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Add Lead</span>
              </Button>
            </Link>
            <Link href="/dashboard/deals">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Create Deal</span>
              </Button>
            </Link>
            <Link href="/dashboard/tasks">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <CheckSquare className="h-5 w-5" />
                <span className="text-xs sm:text-sm">New Task</span>
              </Button>
            </Link>
            <Link href="/dashboard/contacts">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Add Contact</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}