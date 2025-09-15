"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { cachedFetch } from '@/lib/api-cache'

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Hook for optimized data fetching
export function useOptimizedFetch<T>(
  url: string | null,
  options: {
    dependencies?: any[]
    enabled?: boolean
    retryCount?: number
    retryDelay?: number
    cache?: boolean
    ttl?: number
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  } = {}
) {
  const {
    dependencies = [],
    enabled = true,
    retryCount = 3,
    retryDelay = 1000,
    cache = true,
    ttl,
    onSuccess,
    onError
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<LoadingState>('idle')
  const [error, setError] = useState<Error | null>(null)
  const [retries, setRetries] = useState(0)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!url || !enabled) return

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setLoading('loading')
    setError(null)

    try {
      const result = await cachedFetch<T>(url, {
        signal: abortControllerRef.current.signal,
        cache,
        ttl,
        forceRefresh
      } as any)

      if (!abortControllerRef.current.signal.aborted) {
        setData(result)
        setLoading('success')
        setRetries(0)
        onSuccess?.(result)
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        const error = err as Error
        
        // Retry logic
        if (retries < retryCount && error.name !== 'AbortError') {
          setRetries(prev => prev + 1)
          timeoutRef.current = setTimeout(() => {
            fetchData(forceRefresh)
          }, retryDelay * Math.pow(2, retries)) // Exponential backoff
        } else {
          setError(error)
          setLoading('error')
          onError?.(error)
        }
      }
    }
  }, [url, enabled, cache, ttl, retries, retryCount, retryDelay, onSuccess, onError])

  // Refetch function
  const refetch = useCallback((forceRefresh = false) => {
    setRetries(0)
    fetchData(forceRefresh)
  }, [fetchData])

  // Effect for initial fetch and dependency changes
  useEffect(() => {
    fetchData()
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [url, enabled, ...dependencies])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    data,
    loading: loading === 'loading',
    error,
    state: loading,
    refetch,
    isLoading: loading === 'loading',
    isError: loading === 'error',
    isSuccess: loading === 'success',
    isIdle: loading === 'idle'
  }
}

// Hook for paginated data
export function usePaginatedFetch<T>(
  baseUrl: string,
  options: {
    pageSize?: number
    enabled?: boolean
    cache?: boolean
  } = {}
) {
  const { pageSize = 10, enabled = true, cache = true } = options
  
  const [page, setPage] = useState(1)
  const [allData, setAllData] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState<number | null>(null)

  const url = `${baseUrl}?page=${page}&limit=${pageSize}`
  
  const {
    data,
    loading,
    error,
    refetch: refetchPage
  } = useOptimizedFetch<{
    data: T[]
    count: number
    totalCount?: number
  }>(url, {
    enabled,
    cache,
    dependencies: [page],
    onSuccess: (result) => {
      if (page === 1) {
        setAllData(result.data)
      } else {
        setAllData(prev => [...prev, ...result.data])
      }
      
      setHasMore(result.data.length === pageSize)
      setTotalCount(result.totalCount || result.count)
    }
  })

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }, [loading, hasMore])

  const reset = useCallback(() => {
    setPage(1)
    setAllData([])
    setHasMore(true)
    setTotalCount(null)
  }, [])

  const refetch = useCallback(() => {
    reset()
    setTimeout(() => refetchPage(), 0)
  }, [reset, refetchPage])

  return {
    data: allData,
    currentPageData: data?.data || [],
    loading,
    error,
    hasMore,
    totalCount,
    page,
    loadMore,
    reset,
    refetch
  }
}

// Hook for infinite scroll
export function useInfiniteScroll(
  callback: () => void,
  options: {
    threshold?: number
    enabled?: boolean
    rootMargin?: string
  } = {}
) {
  const { threshold = 0.1, enabled = true, rootMargin = '100px' } = options
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !targetRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(targetRef.current)

    return () => observer.disconnect()
  }, [callback, threshold, enabled, rootMargin])

  return targetRef
}

// Hook for debounced search
export function useDebouncedSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  delay = 300
) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounce query
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, delay])

  // Perform search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    const performSearch = async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      setLoading(true)
      setError(null)

      try {
        const searchResults = await searchFn(debouncedQuery)
        
        if (!abortControllerRef.current.signal.aborted) {
          setResults(searchResults)
          setLoading(false)
        }
      } catch (err) {
        if (!abortControllerRef.current.signal.aborted) {
          setError(err as Error)
          setLoading(false)
        }
      }
    }

    performSearch()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedQuery, searchFn])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch
  }
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>() {
  const [data, setData] = useState<T | null>(null)
  const [originalData, setOriginalData] = useState<T | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateOptimistically = useCallback(
    async (
      optimisticData: T,
      updateFn: () => Promise<T>
    ) => {
      setOriginalData(data)
      setData(optimisticData)
      setIsPending(true)
      setError(null)

      try {
        const result = await updateFn()
        setData(result)
        setIsPending(false)
        return result
      } catch (err) {
        // Revert to original data on error
        setData(originalData)
        setError(err as Error)
        setIsPending(false)
        throw err
      }
    },
    [data, originalData]
  )

  const setInitialData = useCallback((initialData: T) => {
    setData(initialData)
    setOriginalData(initialData)
  }, [])

  return {
    data,
    isPending,
    error,
    updateOptimistically,
    setInitialData
  }
}

export default {
  useOptimizedFetch,
  usePaginatedFetch,
  useInfiniteScroll,
  useDebouncedSearch,
  useOptimisticUpdate
}