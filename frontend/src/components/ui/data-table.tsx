import * as React from "react"
import { SimpleTable, SimpleColumn } from "@/components/ui/simple-table"

interface DataTableProps<TData> {
  columns: any[]
  data: TData[]
  searchKey?: string
  filterOptions?: { label: string; value: string; options: { label: string; value: string }[] }[]
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  // Create mock table context for functions that need it
  const mockTableContext = {
    getIsAllPageRowsSelected: () => false,
    toggleAllPageRowsSelected: () => {},
  }

  const mockColumnContext = {
    toggleSorting: () => {},
    getIsSorted: () => false,
  }

  const simpleColumns: SimpleColumn<TData>[] = columns.map((col: any) => ({
    key: (col.accessorKey || col.id) as any,
    header: typeof col.header === 'function' 
      ? col.header({ 
          table: col.id === 'select' ? mockTableContext : undefined,
          column: col.accessorKey === 'title' ? mockColumnContext : undefined 
        }) 
      : col.header,
    cell: col.cell ? ((row: any) => {
      const mockRowContext = {
        getIsSelected: () => false,
        toggleSelected: () => {},
        original: row,
        getValue: () => (row as any)[col.accessorKey]
      }
      return col.cell({ row: mockRowContext })
    }) : undefined,
  }))

  return (
    <div className="space-y-4">
      <SimpleTable columns={simpleColumns} data={data} />
    </div>
  )
}
