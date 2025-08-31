"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, TrendingUp, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { useDealsRealtime } from "@/lib/hooks/useDealsRealtime"
const DealCard = dynamic(() => import("./_components/deal-card").then(m => m.DealCard), { ssr: false })
import { DealForm } from "./_components/deal-form"
import { Deal, DealColumn, DealStage } from "./types"

const emptyColumns: DealColumn[] = [
  { id: "lead", title: "Lead", deals: [] },
  { id: "qualified", title: "Qualified", deals: [] },
  { id: "proposal", title: "Proposal", deals: [] },
  { id: "negotiation", title: "Negotiation", deals: [] },
  { id: "closed_won", title: "Closed Won", deals: [] },
  { id: "closed_lost", title: "Closed Lost", deals: [] },
]

export default function DealsPage() {
  // Use realtime hook instead of manual state management
  const { 
    deals, 
    loading, 
    error, 
    stats, 
    createDeal, 
    updateDeal, 
    deleteDeal 
  } = useDealsRealtime()
  
  const [columns, setColumns] = useState<DealColumn[]>(emptyColumns)
  const [showDealForm, setShowDealForm] = useState<boolean>(false)
  const [editingDeal, setEditingDeal] = useState<Deal | undefined>(undefined)

  // Update columns when deals change
  useEffect(() => {
    const grouped = emptyColumns.map(col => ({ ...col, deals: [] as Deal[] }))
    for (const deal of deals) {
      const idx = grouped.findIndex((c) => c.id === deal.stage)
      if (idx >= 0) grouped[idx].deals.push(deal)
    }
    setColumns(grouped)
  }, [deals])

  const handleDealSubmit = async (dealData: Deal) => {
    try {
      if (editingDeal) {
        await updateDeal(editingDeal.id, dealData)
      } else {
        await createDeal(dealData)
      }
      setShowDealForm(false)
      setEditingDeal(undefined)
    } catch (error) {
      console.error('Error submitting deal:', error)
    }
  }

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal)
    setShowDealForm(true)
  }

  const handleDeleteDeal = async (dealId: string) => {
    const ok = confirm('Are you sure you want to delete this deal?')
    if (!ok) return
    
    try {
      await deleteDeal(dealId)
    } catch (error) {
      console.error('Error deleting deal:', error)
    }
  }

  const moveDeal = async (dealId: string, direction: 'left' | 'right') => {
    setColumns((prev) => {
      let fromCol = -1, dealIdx = -1
      for (let i = 0; i < prev.length; i++) {
        dealIdx = prev[i].deals.findIndex(d => d.id === dealId)
        if (dealIdx !== -1) { fromCol = i; break }
      }
      if (fromCol === -1) return prev
      const toCol = direction === 'left' ? Math.max(0, fromCol - 1) : Math.min(prev.length - 1, fromCol + 1)
      if (toCol === fromCol) return prev
      const next = prev.map(c => ({ ...c, deals: [...c.deals] }))
      const [deal] = next[fromCol].deals.splice(dealIdx, 1)
      deal.stage = next[toCol].id as DealStage
      next[toCol].deals.push(deal)
      
      // Use realtime hook for persistent update
      updateDeal(deal.id, { stage: deal.stage })
      return next
    })
  }

  const getColumnTotal = (deals: Deal[]) => {
    return deals.reduce((sum, deal) => sum + deal.amount, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deals</h1>
          <p className="text-muted-foreground">
            Manage your sales pipeline and track deals
          </p>
        </div>
        <Button onClick={() => setShowDealForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

      {/* Real-time Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              Active pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Pipeline value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stageBreakdown.closed_won.count}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.stageBreakdown.closed_won.value.toLocaleString()} won
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Negotiation</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stageBreakdown.negotiation.count}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.stageBreakdown.negotiation.value.toLocaleString()} potential
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading deals: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Deal Form Modal */}
      <DealForm
        deal={editingDeal}
        isOpen={showDealForm}
        onClose={() => {
          setShowDealForm(false)
          setEditingDeal(undefined)
        }}
        onSubmit={handleDealSubmit}
      />

      {/* Deal Pipeline Columns */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="w-80 flex-shrink-0">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">{column.title}</h3>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">
                  ${getColumnTotal(column.deals).toLocaleString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {column.deals.length} deals
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              {column.deals.map((deal) => (
                <div key={deal.id}>
                  <DealCard deal={deal} onMove={moveDeal} />
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEditDeal(deal)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDeleteDeal(deal.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                onClick={() => setShowDealForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add deal
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">Loading deals...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
