"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Task } from '../tasks/types'

interface TasksPriorityChartProps {
  tasks: Task[]
  stats: any
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function TasksPriorityChart({ tasks, stats }: TasksPriorityChartProps) {
  // Prepare data for priority breakdown pie chart
  const priorityPieData = Object.entries(stats.priorityBreakdown || {}).map(([priority, count]: [string, any]) => ({
    name: priority,
    value: count
  }))

  // Prepare data for status breakdown bar chart
  const statusBarData = Object.entries(stats.statusBreakdown || {}).map(([status, count]: [string, any]) => ({
    name: status,
    value: count
  }))

  // Prepare data for timeline chart (tasks over time)
  // For simplicity, we'll group by creation date
  const timelineData = tasks.reduce((acc: any[], task) => {
    const date = new Date(task.createdAt).toLocaleDateString()
    const existing = acc.find(item => item.date === date)
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ date, count: 1 })
    }
    return acc
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Priority Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityPieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {priorityPieData.map((entry, index) => (
                  <Cell key={`priority-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Tasks']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusBarData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Tasks']} />
              <Legend />
              <Bar dataKey="value" name="Tasks" fill="#8884d8">
                {statusBarData.map((entry, index) => (
                  <Cell key={`status-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Timeline Line Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Tasks Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timelineData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Tasks']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Tasks Created" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}