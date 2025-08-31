"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {action && (
            <ToastClose asChild>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  action.onClick()
                }}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {action.label}
              </button>
            </ToastClose>
          )}
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

/**
 * A higher-level toast function that can be used directly in your components
 * without needing to use the useToast hook.
 * 
 * @example
 * // Basic usage
 * toast({
 *   title: "Success!",
 *   description: "Your changes have been saved.",
 *   variant: "success"
 * })
 * 
 * // With action
 * toast({
 *   title: "Action required",
 *   description: "Please confirm your email address.",
 *   action: {
 *     label: "Resend",
 *     onClick: () => console.log("Resending email...")
 *   }
 * })
 */
export function toast({
  title,
  description,
  variant = "default",
  action,
  duration = 5000,
  ...props
}: {
  title: string
  description?: string
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  action?: {
    label: string
    onClick: () => void | Promise<void>
  }
  duration?: number
}) {
  const { toast: showToast } = useToast()
  
  return showToast({
    title,
    description,
    variant,
    action,
    duration,
    ...props,
  })
}

// Re-export the toast function as default for easier imports
export default toast
