"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Building2, User, Calendar } from "lucide-react"
import { Deal, DealStage } from "../types"

export function DealCard({ deal, onMove }: { deal: Deal; onMove?: (dealId: string, direction: 'left' | 'right') => void }) {

  const getStageVariant = (stage: string) => {
    switch (stage) {
      case 'lead':
        return 'secondary'
      case 'qualified':
        return 'default'
      case 'proposal':
        return 'outline'
      case 'negotiation':
        return 'default'
      case 'closed_won':
        return 'success'
      case 'closed_lost':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Card className="mb-3 relative">
      <div className="absolute right-2 top-2 flex items-center gap-1">
        <button
          aria-label="Move left"
          className="p-1 rounded hover:bg-accent text-muted-foreground"
          onClick={() => onMove?.(deal.id, 'left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          aria-label="Move right"
          className="p-1 rounded hover:bg-accent text-muted-foreground"
          onClick={() => onMove?.(deal.id, 'right')}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{deal.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-medium">
              ${deal.amount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Probability</span>
            <span className="font-medium">{deal.probability}%</span>
          </div>
          
          {deal.company && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Company:</span>
              <span className="font-medium">{deal.company}</span>
              {deal.companyIndustry && (
                <Badge variant="outline" className="text-xs">
                  {deal.companyIndustry}
                </Badge>
              )}
            </div>
          )}
          
          {deal.contact && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Contact:</span>
              <span className="font-medium">{deal.contact}</span>
            </div>
          )}
          
          {deal.closeDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Close Date:</span>
              <span className="font-medium">
                {new Date(deal.closeDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
          
          <div className="pt-2">
            <Badge variant={getStageVariant(deal.stage)} className="capitalize">
              {deal.stage.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
