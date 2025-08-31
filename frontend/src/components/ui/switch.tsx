"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BasicSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, BasicSwitchProps>(
  ({ className, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState<boolean>(Boolean(defaultChecked))

    React.useEffect(() => {
      if (typeof checked === 'boolean') setIsChecked(checked)
    }, [checked])

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={(e) => {
          const next = !isChecked
          if (typeof checked !== 'boolean') setIsChecked(next)
          onChange?.({
            ...e,
            target: { checked: next }
          } as any)
        }}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? 'bg-primary' : 'bg-input',
          className
        )}
        ref={ref as any}
        {...props as any}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            isChecked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
