import * as React from "react"
import { Input } from "@/components/ui/input"

export interface FilterOption {
  label: string
  value: string
  options: { label: string; value: string }[]
}

interface DataTableToolbarProps { searchKey?: string }

export function DataTableToolbar({}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Input placeholder="Search..." className="h-9 w-full pl-8" disabled />
        </div>
      </div>
    </div>
  )
}
