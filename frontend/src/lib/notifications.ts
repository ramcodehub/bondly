"use client"

import { toast } from "sonner"

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

class NotificationService {
  private static instance: NotificationService
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  public success(message: string, options?: ToastOptions) {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    })
  }

  public error(message: string, options?: ToastOptions) {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    })
  }

  public warning(message: string, options?: ToastOptions) {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    })
  }

  public info(message: string, options?: ToastOptions) {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    })
  }

  public promise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) {
    return toast.promise(promise, {
      loading,
      success,
      error
    })
  }

  // Specialized notifications for common CRM actions
  public leadCreated(leadName: string) {
    this.success(`Lead "${leadName}" created successfully`, {
      description: 'The lead has been added to your CRM',
      action: {
        label: 'View Leads',
        onClick: () => window.location.href = '/dashboard/leads'
      }
    })
  }

  public leadUpdated(leadName: string) {
    this.success(`Lead "${leadName}" updated successfully`)
  }

  public leadDeleted(leadName: string) {
    this.success(`Lead "${leadName}" deleted successfully`)
  }

  public apiError(error: any, context?: string) {
    const message = this.getErrorMessage(error)
    const description = context ? `Error in ${context}` : undefined
    
    this.error(message, {
      description,
      action: {
        label: 'Retry',
        onClick: () => window.location.reload()
      }
    })
  }

  public networkError() {
    this.error('Network connection error', {
      description: 'Please check your internet connection and try again',
      action: {
        label: 'Retry',
        onClick: () => window.location.reload()
      }
    })
  }

  public validationError(message: string) {
    this.warning('Validation Error', {
      description: message,
      duration: 5000
    })
  }

  public unauthorized() {
    this.error('Access Denied', {
      description: 'You are not authorized to perform this action',
      action: {
        label: 'Login',
        onClick: () => window.location.href = '/login'
      }
    })
  }

  private getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error
    }
    
    if (error?.message) {
      return error.message
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error?.response?.statusText) {
      return error.response.statusText
    }
    
    return 'An unexpected error occurred'
  }

  // Dismiss all toasts
  public dismissAll() {
    toast.dismiss()
  }
}

// Export singleton instance
export const notifications = NotificationService.getInstance()

// Export individual methods for convenience
export const {
  success,
  error,
  warning,
  info,
  promise,
  leadCreated,
  leadUpdated,
  leadDeleted,
  apiError,
  networkError,
  validationError,
  unauthorized,
  dismissAll
} = notifications