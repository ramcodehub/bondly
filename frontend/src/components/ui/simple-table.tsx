import * as React from "react"
import { cn } from "@/lib/utils"

export type SimpleColumn<T = any> = {
  key?: keyof T | string
  header: React.ReactNode
  className?: string
  cell?: (row: T) => React.ReactNode
}

export interface SimpleTableProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  columns: SimpleColumn<T>[]
  data: T[]
  emptyText?: string
}

export function SimpleTable<T = any>({ columns, data, emptyText = "No results.", className }: SimpleTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-md border", className)}>
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={cn("text-left font-medium px-3 py-2", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((row, ri) => (
              <tr key={ri} className="border-t">
                {columns.map((col, ci) => (
                  <td key={ci} className={cn("px-3 py-2 align-middle", col.className)}>
                    {col.cell ? col.cell(row) : (col.key ? (row as any)[col.key as any] : null)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SimpleTable


