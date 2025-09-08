"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Deal } from '../deals/types'

interface DealsStageChartProps {
  deals: Deal[]
  stats: any
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export function DealsStageChart({ deals, stats }: DealsStageChartProps) {
  // Prepare data for funnel chart
  const funnelData = Object.entries(stats.stageBreakdown || {}).map(([stage, data]: [string, any]) => ({
    stage,
    count: data.count,
    value: data.value
  })).sort((a, b) => b.count - a.count)

  // Prepare data for pie chart
  const pieData = Object.entries(stats.stageBreakdown || {}).map(([stage, data]: [string, any]) => ({
    name: stage,
    value: data.count,
    amount: data.value
  }))

  // Prepare data for bar chart
  const barData = Object.entries(stats.stageBreakdown || {}).map(([stage, data]: [string, any]) => ({
    name: stage,
    deals: data.count,
    value: data.value
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Funnel Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Stages Funnel</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === 'count') return [value, 'Deals']
                  if (name === 'value') return [`$${value?.toLocaleString()}`, 'Value']
                  return [value, name]
                }}
                labelFormatter={(value) => `Stage: ${value}`}
              />
              <Funnel
                dataKey="count"
                data={funnelData}
                isAnimationActive
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`funnel-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList position="right" fill="#000" stroke="none" dataKey="count" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Stages Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === 'value') return [value, 'Deals']
                  if (props.payload.amount) return [`$${props.payload.amount?.toLocaleString()}`, 'Value']
                  return [value, name]
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Deals by Stage</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis yAxisId="deals" orientation="left" />
              <YAxis yAxisId="value" orientation="right" />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === 'deals') return [value, 'Deals']
                  if (name === 'value') return [`$${value?.toLocaleString()}`, 'Value']
                  return [value, name]
                }}
              />
              <Legend />
              <Bar yAxisId="deals" dataKey="deals" name="Deals" fill="#8884d8">
                {barData.map((entry, index) => (
                  <Cell key={`deals-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar yAxisId="value" dataKey="value" name="Value ($)" fill="#82ca9d">
                {barData.map((entry, index) => (
                  <Cell key={`value-cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}