"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react'

interface ApiErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ApiErrorState {
  hasError: boolean
  error?: string
  isRetrying: boolean
  retryCount: number
}

const ApiErrorBoundary: React.FC<ApiErrorBoundaryProps> = ({ children, fallback }) => {
  const [errorState, setErrorState] = useState<ApiErrorState>({
    hasError: false,
    isRetrying: false,
    retryCount: 0
  })
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleApiError = (error: string) => {
    setErrorState(prev => ({
      ...prev,
      hasError: true,
      error,
      isRetrying: false
    }))
  }

  const handleRetry = async () => {
    setErrorState(prev => ({
      ...prev,
      isRetrying: true,
      retryCount: prev.retryCount + 1
    }))

    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000))

    setErrorState({
      hasError: false,
      isRetrying: false,
      retryCount: 0
    })
  }

  const renderError = () => {
    if (fallback) {
      return fallback
    }

    const isNetworkError = !isOnline || errorState.error?.includes('network') || errorState.error?.includes('fetch')

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            {isNetworkError ? (
              <WifiOff className="h-6 w-6 text-destructive" />
            ) : (
              <AlertCircle className="h-6 w-6 text-destructive" />
            )}
          </div>
          <CardTitle className="text-lg">
            {isNetworkError ? 'Connection Problem' : 'Service Unavailable'}
          </CardTitle>
          <CardDescription>
            {isNetworkError 
              ? 'Please check your internet connection and try again.'
              : 'We\'re having trouble loading this content. Please try again.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isOnline && (
            <Alert>
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                You appear to be offline. Please check your internet connection.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleRetry} 
              disabled={errorState.isRetrying}
              className="w-full"
            >
              {errorState.isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again {errorState.retryCount > 0 && `(${errorState.retryCount})`}
                </>
              )}
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && errorState.error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Show Error Details (Development Only)
              </summary>
              <div className="mt-2 rounded-md bg-muted p-3 text-xs font-mono">
                <div className="text-destructive">
                  API Error: {errorState.error}
                </div>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    )
  }

  if (errorState.hasError) {
    return (
      <div className="min-h-[200px] flex items-center justify-center p-4">
        {renderError()}
      </div>
    )
  }

  return (
    <ApiErrorProvider onError={handleApiError}>
      {children}
    </ApiErrorProvider>
  )
}

// Context for handling API errors throughout the app
const ApiErrorContext = React.createContext<{
  reportError: (error: string) => void
}>({
  reportError: () => {}
})

const ApiErrorProvider: React.FC<{ 
  children: React.ReactNode
  onError: (error: string) => void 
}> = ({ children, onError }) => {
  return (
    <ApiErrorContext.Provider value={{ reportError: onError }}>
      {children}
    </ApiErrorContext.Provider>
  )
}

export const useApiError = () => {
  const context = React.useContext(ApiErrorContext)
  if (!context) {
    throw new Error('useApiError must be used within an ApiErrorProvider')
  }
  return context
}

export default ApiErrorBoundary