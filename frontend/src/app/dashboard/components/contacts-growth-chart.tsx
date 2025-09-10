"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ContactsGrowthChartProps {
  contactsData: any[]
  stats: any
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function ContactsGrowthChart({ contactsData, stats }: ContactsGrowthChartProps) {
  // Prepare data for contacts growth over time
  // This is a mockup since we don't have actual time-series data
  const growthData = [
    { month: 'Jan', contacts: 20 },
    { month: 'Feb', contacts: 35 },
    { month: 'Mar', contacts: 42 },
    { month: 'Apr', contacts: 58 },
    { month: 'May', contacts: 65 },
    { month: 'Jun', contacts: 87 },
  ]

  // Prepare data for companies vs contacts
  const companiesContactsData = [
    { name: 'Companies', value: stats.companies || 0 },
    { name: 'Contacts', value: stats.contacts || 0 }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Contacts Growth Line Chart */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Contacts Growth</CardTitle>
        </CardHeader>
        <CardContent className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Contacts']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="contacts" 
                name="Contacts" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Companies vs Contacts Bar Chart */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Companies vs Contacts</CardTitle>
        </CardHeader>
        <CardContent className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={companiesContactsData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Count']} />
              <Legend />
              <Bar dataKey="value" name="Count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contacts Growth Area Chart */}
      <Card className="md:col-span-2 min-w-0">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Contacts Accumulation</CardTitle>
        </CardHeader>
        <CardContent className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={growthData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Contacts']} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="contacts" 
                name="Contacts" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}