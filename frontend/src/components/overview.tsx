"use client"

import * as React from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Icons } from "./icons"
import supabase from '@/lib/supabase-client'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export function Overview() {
  const [chartData, setChartData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        
        // Fetch deals data for the last 7 months
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('amount, created_at')
          .gte('created_at', new Date(Date.now() - 7 * 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 months
          .order('created_at', { ascending: true })

        if (dealsError) throw dealsError

        // Group data by month
        const monthlyData: Record<string, { revenue: number; deals: number }> = {}
        
        // Initialize all months
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthKey = date.toLocaleString('default', { month: 'short' })
          monthlyData[monthKey] = { revenue: 0, deals: 0 }
        }

        // Process deals data
        dealsData?.forEach(deal => {
          const date = new Date(deal.created_at)
          const monthKey = date.toLocaleString('default', { month: 'short' })
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].revenue += deal.amount || 0
            monthlyData[monthKey].deals += 1
          }
        })

        // Convert to chart format
        const labels = Object.keys(monthlyData)
        const revenueData = Object.values(monthlyData).map(item => item.revenue)
        const dealsDataArray = Object.values(monthlyData).map(item => item.deals)

        setChartData({
          labels,
          datasets: [
            {
              label: 'Revenue ($)',
              data: revenueData,
              borderColor: 'hsl(221.2 83.2% 53.3%)',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              tension: 0.3,
              fill: true,
              yAxisID: 'y',
            },
            {
              label: 'Deals Closed',
              data: dealsDataArray,
              borderColor: 'hsl(142.1 76.2% 36.3%)',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              tension: 0.3,
              borderDash: [5, 5],
              yAxisID: 'y1',
            },
          ],
        })
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--background))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--muted-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              if (label.includes('$')) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(context.parsed.y)
              } else {
                label += context.parsed.y
              }
            }
            return label
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: function(value: any) {
            return '$' + value.toLocaleString()
          },
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
      </div>
    )
  }

  return (
    <div className="h-[350px] w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Revenue Overview</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icons.barChart3 className="h-4 w-4" />
          <span>Last 7 months</span>
        </div>
      </div>
      {chartData && <Line options={options} data={chartData} />}
    </div>
  )
}