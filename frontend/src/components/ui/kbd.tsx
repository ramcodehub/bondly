import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const kbdVariants = cva(
  "inline-flex items-center justify-center rounded border font-mono text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground",
        outline: "border-border bg-background text-foreground",
      },
      size: {
        default: "h-5 min-w-[1.25rem] px-1.5",
        sm: "h-4 min-w-[1rem] px-1 text-[0.625rem]",
        lg: "h-6 min-w-[1.5rem] px-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  /**
   * The keyboard key to display
   */
  children: React.ReactNode
}

/**
 * Displays a keyboard key or shortcut in a clean, consistent way.
 * 
 * @example
 * ```tsx
 * <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
 * ```
 */
function Kbd({ className, variant, size, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        kbdVariants({ variant, size, className }),
        "select-none"
      )}
      {...props}
    />
  )
}

export { Kbd, kbdVariants }
