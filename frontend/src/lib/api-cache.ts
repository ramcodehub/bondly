"use client"

// Cache configuration
interface CacheConfig {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of cached items
  persist?: boolean // Whether to persist to localStorage
}

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

// API Cache class
export class ApiCache {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes
  private maxSize = 100
  private persistKey = 'api-cache'

  constructor(config: CacheConfig = {}) {
    this.defaultTTL = config.ttl || this.defaultTTL
    this.maxSize = config.maxSize || this.maxSize
    
    if (config.persist && typeof window !== 'undefined') {
      this.loadFromStorage()
    }
  }

  // Generate cache key
  private generateKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET'
    const body = options?.body ? JSON.stringify(options.body) : ''
    return `${method}:${url}:${body}`
  }

  // Check if item is expired
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl
  }

  // Clean expired items
  private cleanup(): void {
    // Convert entries to array for iteration to avoid TypeScript errors
    const entries = Array.from(this.cache.entries())
    for (const [key, item] of entries) {
      if (this.isExpired(item)) {
        this.cache.delete(key)
      }
    }
  }

  // Evict oldest items if cache is full
  private evictOldest(): void {
    if (this.cache.size >= this.maxSize) {
      const oldest = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0]
      
      if (oldest) {
        this.cache.delete(oldest[0])
      }
    }
  }

  // Load cache from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.persistKey)
      if (stored) {
        const data = JSON.parse(stored)
        for (const [key, item] of Object.entries(data)) {
          if (!this.isExpired(item as CacheItem<any>)) {
            this.cache.set(key, item as CacheItem<any>)
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error)
    }
  }

  // Save cache to localStorage
  private saveToStorage(): void {
    try {
      // Convert cache entries to a plain object for serialization
      const entriesObj: Record<string, CacheItem<any>> = {}
      this.cache.forEach((value, key) => {
        entriesObj[key] = value
      })
      const data = entriesObj
      localStorage.setItem(this.persistKey, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save cache to storage:', error)
    }
  }

  // Get item from cache
  get<T>(url: string, options?: RequestInit): T | null {
    const key = this.generateKey(url, options)
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    if (this.isExpired(item)) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  // Set item in cache
  set<T>(url: string, data: T, options?: RequestInit & { ttl?: number }): void {
    const key = this.generateKey(url, options)
    const ttl = options?.ttl || this.defaultTTL
    
    this.cleanup()
    this.evictOldest()
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      key
    })
    
    if (typeof window !== 'undefined') {
      this.saveToStorage()
    }
  }

  // Delete item from cache
  delete(url: string, options?: RequestInit): boolean {
    const key = this.generateKey(url, options)
    const deleted = this.cache.delete(key)
    
    if (deleted && typeof window !== 'undefined') {
      this.saveToStorage()
    }
    
    return deleted
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.persistKey)
    }
  }

  // Invalidate cache by pattern
  invalidate(pattern: string): void {
    // Convert keys to array for iteration to avoid TypeScript errors
    const keys = Array.from(this.cache.keys())
    for (const key of keys) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  // Invalidate cache by pattern
  invalidatePattern(pattern: string): number {
    let count = 0
    
    // Convert keys to array for iteration to avoid TypeScript errors
    const keys = Array.from(this.cache.keys())
    for (const key of keys) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
        count++
      }
    }
    
    if (count > 0 && typeof window !== 'undefined') {
      this.saveToStorage()
    }
    
    return count
  }

  // Get cache stats
  getStats(): {
    size: number
    maxSize: number
    hitRate: number
    memoryUsage: number
  } {
    const size = this.cache.size
    // Convert cache entries to a plain object for measuring memory usage
    const entriesObj: Record<string, CacheItem<any>> = {}
    this.cache.forEach((value, key) => {
      entriesObj[key] = value
    })
    const memoryUsage = JSON.stringify(entriesObj).length
    
    return {
      size,
      maxSize: this.maxSize,
      hitRate: 0, // Would need to track hits/misses
      memoryUsage
    }
  }
}

// Create default cache instance
const defaultCache = new ApiCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  persist: true
})

// Enhanced fetch with caching
export async function cachedFetch<T>(
  url: string,
  options: RequestInit & { 
    cache?: boolean
    ttl?: number
    forceRefresh?: boolean
  } = {}
): Promise<T> {
  const {
    cache: useCache = true,
    ttl,
    forceRefresh = false,
    ...fetchOptions
  } = options

  // Don't cache non-GET requests by default
  const shouldCache = useCache && (fetchOptions.method || 'GET') === 'GET'

  // Check cache first (unless force refresh)
  if (shouldCache && !forceRefresh) {
    const cached = defaultCache.get<T>(url, fetchOptions)
    if (cached) {
      return cached
    }
  }

  // Make request
  const response = await fetch(url, fetchOptions)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  // Cache successful GET responses
  if (shouldCache && response.ok) {
    defaultCache.set(url, data, { ...fetchOptions, ttl })
  }

  return data
}

// Hook for React components
export function useApiCache() {
  const invalidateCache = (pattern?: string) => {
    if (pattern) {
      return defaultCache.invalidatePattern(pattern)
    } else {
      defaultCache.clear()
    }
  }

  const getCacheStats = () => defaultCache.getStats()

  return {
    invalidateCache,
    getCacheStats,
    cache: defaultCache
  }
}

// Response caching for API routes
export class ResponseCache {
  private static instance: ResponseCache
  private cache = new Map<string, { data: any; timestamp: number; etag?: string }>()
  private ttl = 5 * 60 * 1000 // 5 minutes

  static getInstance(): ResponseCache {
    if (!ResponseCache.instance) {
      ResponseCache.instance = new ResponseCache()
    }
    return ResponseCache.instance
  }

  // Cache response with ETag support
  cacheResponse(key: string, data: any, etag?: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      etag
    })
  }

  // Get cached response
  getCachedResponse(key: string): { data: any; etag?: string } | null {
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return {
      data: cached.data,
      etag: cached.etag
    }
  }

  // Invalidate cache by pattern
  invalidate(pattern: string): void {
    // Convert keys to array for iteration to avoid TypeScript errors
    const keys = Array.from(this.cache.keys())
    for (const key of keys) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }
}

// Service Worker cache utilities (if using PWA)
export const swCache = {
  // Cache API responses in Service Worker
  async cacheApiResponse(request: Request, response: Response): Promise<void> {
    if (typeof caches === 'undefined') return
    
    const cache = await caches.open('api-cache-v1')
    await cache.put(request, response.clone())
  },

  // Get cached API response from Service Worker
  async getCachedApiResponse(request: Request): Promise<Response | undefined> {
    if (typeof caches === 'undefined') return undefined
    
    const cache = await caches.open('api-cache-v1')
    return await cache.match(request)
  },

  // Clear API cache in Service Worker
  async clearApiCache(): Promise<void> {
    if (typeof caches === 'undefined') return
    
    await caches.delete('api-cache-v1')
  }
}

// Export the default cache instance
export default defaultCache