import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface SheetTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface SheetContentProps {
  side?: "left" | "right" | "top" | "bottom"
  children: React.ReactNode
  className?: string
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <div className={cn("fixed inset-0 z-50", !open && "hidden")}>
      {children}
    </div>
  )
}

export function SheetTrigger({ asChild, children }: SheetTriggerProps) {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => {
        // This will be handled by the parent Sheet component
      }
    })
  }
  return <>{children}</>
}

export function SheetContent({ side = "left", children, className }: SheetContentProps) {
  const sideClasses = {
    left: "left-0 top-0 h-full w-80 border-r",
    right: "right-0 top-0 h-full w-80 border-l",
    top: "top-0 left-0 h-80 w-full border-b",
    bottom: "bottom-0 left-0 h-80 w-full border-t"
  }

  return (
    <div className={cn(
      "fixed bg-background shadow-lg transition-transform",
      sideClasses[side],
      className
    )}>
      {children}
    </div>
  )
}
