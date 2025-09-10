"use client"

import { useState, useEffect } from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Button } from "@/components/ui/button"
import { Eye, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

interface MetricTooltipProps {
  children: React.ReactNode
  title: string
  description: string
  details?: {
    label: string
    value: string | number
  }[]
  linkHref: string
  linkText: string
  detailedData?: any[]
  dataColumns?: { key: string; label: string }[]
}

export function MetricTooltip({ 
  children, 
  title, 
  description, 
  details = [], 
  linkHref,
  linkText,
  detailedData = [],
  dataColumns = []
}: MetricTooltipProps) {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogData, setDialogData] = useState<any[]>(detailedData)
  const [dialogColumns, setDialogColumns] = useState<{ key: string; label: string }[]>(dataColumns)

  // Update dialog data when detailedData changes
  useEffect(() => {
    setDialogData(detailedData)
    setDialogColumns(dataColumns)
  }, [detailedData, dataColumns])

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    setDialogOpen(true)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <div 
              className="cursor-pointer inline-block"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              {children}
            </div>
          </TooltipTrigger>
          <TooltipPrimitive.Content 
            className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 p-4 bg-white rounded-lg shadow-lg border max-w-xs sm:max-w-sm"
            side="top"
          >
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{description}</p>
              </div>
              
              {details.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="space-y-1">
                    {details.map((detail, index) => (
                      <div key={index} className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">{detail.label}:</span>
                        <span className="font-medium">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-2 flex gap-2 flex-col sm:flex-row">
                <Link href={linkHref}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {linkText}
                  </Button>
                </Link>
                {detailedData.length > 0 && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full text-xs sm:text-sm"
                    onClick={handleViewDetails}
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    View Popup
                  </Button>
                )}
              </div>
            </div>
          </TooltipPrimitive.Content>
        </Tooltip>
      </TooltipProvider>

      {/* Detailed Data Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xs sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-base sm:text-lg">{title} Details</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            {dialogData.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {dialogColumns.map((column, index) => (
                          <th key={index} className="px-2 py-1 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-medium text-gray-500">
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dialogData.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          {dialogColumns.map((column, colIndex) => (
                            <td key={colIndex} className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                              {item[column.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 sm:py-8 text-gray-500 text-sm sm:text-base">
                No detailed data available
              </div>
            )}
            <div className="flex justify-end">
              <Link href={linkHref}>
                <Button className="text-xs sm:text-sm" onClick={() => setDialogOpen(false)}>
                  View Full List
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}