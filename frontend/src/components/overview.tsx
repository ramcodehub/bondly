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

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
const revenueData = [6500, 5900, 8000, 8100, 8600, 10500, 12000]
const dealsData = [12, 15, 18, 14, 20, 22, 25]

export function Overview() {
  const [chartData, setChartData] = React.useState({
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
        data: dealsData,
        borderColor: 'hsl(142.1 76.2% 36.3%)',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.3,
        borderDash: [5, 5],
        yAxisID: 'y1',
      },
    ],
  })

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

  return (
    <div className="h-[350px] w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Revenue Overview</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icons.barChart3 className="h-4 w-4" />
          <span>Last 7 months</span>
        </div>
      </div>
      <Line options={options} data={chartData} />
    </div>
  )
}
