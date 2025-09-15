"use client"

// Performance monitoring utilities
export class PerformanceMonitor {
  private metrics: Map<string, { value: number; timestamp: number }[]>;
  private observers: Map<string, PerformanceObserver>;
  private thresholds: Record<string, number>;

  constructor() {
    this.metrics = new Map()
    this.observers = new Map()
    this.thresholds = {
      LCP: 2500, // Largest Contentful Paint
      FID: 100,  // First Input Delay
      CLS: 0.1,  // Cumulative Layout Shift
      FCP: 1800, // First Contentful Paint
      TTFB: 800  // Time to First Byte
    }
  }

  // Initialize performance monitoring
  init() {
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    this.observeFCP()
    this.observeTTFB()

    // Monitor custom metrics
    this.observeCustomMetrics()

    // Report metrics periodically
    this.startReporting()
  }

  // Largest Contentful Paint
  observeLCP() {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      this.recordMetric('LCP', lastEntry.startTime)
      
      if (lastEntry.startTime > this.thresholds.LCP) {
        this.reportSlowMetric('LCP', lastEntry.startTime)
      }
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.set('LCP', observer)
  }

  // First Input Delay
  observeFID() {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime)
        
        if (entry.processingStart - entry.startTime > this.thresholds.FID) {
          this.reportSlowMetric('FID', entry.processingStart - entry.startTime)
        }
      })
    })

    observer.observe({ entryTypes: ['first-input'] })
    this.observers.set('FID', observer)
  }

  // Cumulative Layout Shift
  observeCLS() {
    if (!('PerformanceObserver' in window)) return

    let clsValue = 0
    let clsEntries: any[] = []
    let sessionValue = 0
    let sessionEntries: any[] = []

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = sessionEntries[0]
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

          if (sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += (entry as any).value
            sessionEntries.push(entry)
          } else {
            sessionValue = (entry as any).value
            sessionEntries = [entry]
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue
            clsEntries = [...sessionEntries]
            
            this.recordMetric('CLS', clsValue)
            
            if (clsValue > this.thresholds.CLS) {
              this.reportSlowMetric('CLS', clsValue)
            }
          }
        }
      }
    })

    observer.observe({ entryTypes: ['layout-shift'] })
    this.observers.set('CLS', observer)
  }

  // First Contentful Paint
  observeFCP() {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime)
          
          if (entry.startTime > this.thresholds.FCP) {
            this.reportSlowMetric('FCP', entry.startTime)
          }
        }
      })
    })

    observer.observe({ entryTypes: ['paint'] })
    this.observers.set('FCP', observer)
  }

  // Time to First Byte
  observeTTFB() {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.entryType === 'navigation') {
          const ttfb = entry.responseStart - entry.requestStart
          this.recordMetric('TTFB', ttfb)
          
          if (ttfb > this.thresholds.TTFB) {
            this.reportSlowMetric('TTFB', ttfb)
          }
        }
      })
    })

    observer.observe({ entryTypes: ['navigation'] })
    this.observers.set('TTFB', observer)
  }

  // Monitor custom metrics
  observeCustomMetrics() {
    // Monitor React component render times
    this.observeComponentRenders()
    
    // Monitor API response times
    this.observeApiCalls()
    
    // Monitor memory usage
    this.observeMemoryUsage()
  }

  // Component render time monitoring
  observeComponentRenders() {
    if (typeof window.performance?.mark !== 'function') return

    // This would be integrated with React DevTools or custom hooks
    // For now, we'll track route changes
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = (...args) => {
      this.startTimer('route-change')
      return originalPushState.apply(history, args)
    }

    history.replaceState = (...args) => {
      this.startTimer('route-change')
      return originalReplaceState.apply(history, args)
    }

    window.addEventListener('popstate', () => {
      this.startTimer('route-change')
    })
  }

  // API call monitoring
  observeApiCalls() {
    const originalFetch = window.fetch
    
    window.fetch = async (...args) => {
      const startTime = performance.now()
      const url = args[0]
      
      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const duration = endTime - startTime
        
        this.recordMetric(`API:${url}`, duration)
        
        if (duration > 2000) {
          this.reportSlowMetric(`API:${url}`, duration)
        }
        
        return response
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        
        this.recordMetric(`API_ERROR:${url}`, duration)
        this.reportError('API Error', error as Error, { url, duration })
        
        throw error
      }
    }
  }

  // Memory usage monitoring
  observeMemoryUsage() {
    if (!('memory' in performance)) return

    setInterval(() => {
      const memory = (performance as any).memory
      
      this.recordMetric('memory.used', memory.usedJSHeapSize)
      this.recordMetric('memory.total', memory.totalJSHeapSize)
      this.recordMetric('memory.limit', memory.jsHeapSizeLimit)
      
      // Alert if memory usage is high
      const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
      if (usage > 0.8) {
        this.reportSlowMetric('memory.high_usage', usage)
      }
    }, 30000) // Every 30 seconds
  }

  // Start/end timers for custom metrics
  startTimer(name: string) {
    if (typeof window.performance?.mark !== 'function') return
    
    performance.mark(`${name}-start`)
  }

  endTimer(name: string) {
    if (typeof window.performance?.mark !== 'function') return
    
    performance.mark(`${name}-end`)
    
    try {
      performance.measure(name, `${name}-start`, `${name}-end`)
      const entries = performance.getEntriesByName(name)
      const latest = entries[entries.length - 1]
      
      this.recordMetric(name, latest.duration)
      
      // Cleanup
      performance.clearMarks(`${name}-start`)
      performance.clearMarks(`${name}-end`)
      performance.clearMeasures(name)
    } catch (error) {
      console.warn('Timer measurement failed:', error)
    }
  }

  // Record metric
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const metricArray = this.metrics.get(name);
    if (metricArray) {
      metricArray.push({
        value,
        timestamp: Date.now()
      })
      
      // Keep only last 100 entries per metric
      if (metricArray.length > 100) {
        metricArray.splice(0, metricArray.length - 100)
      }
    }
  }

  // Report slow metrics
  reportSlowMetric(name: string, value: number) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Slow ${name}:`, value, 'ms')
    }
    
    // In production, send to monitoring service
    this.sendToMonitoring('slow_metric', {
      metric: name,
      value,
      threshold: this.thresholds[name],
      timestamp: Date.now(),
      url: window.location.href
    })
  }

  // Report errors
  reportError(type: string, error: Error, metadata = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`${type}:`, error, metadata)
    }
    
    this.sendToMonitoring('error', {
      type,
      message: error.message,
      stack: error.stack,
      metadata,
      timestamp: Date.now(),
      url: window.location.href
    })
  }

  // Send data to monitoring service
  sendToMonitoring(type: string, data: any) {
    // In a real app, send to monitoring service like DataDog, New Relic, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example: analytics.track(type, data)
      console.log('MONITORING:', type, data)
    }
  }

  // Start periodic reporting
  startReporting() {
    setInterval(() => {
      this.reportMetrics()
    }, 60000) // Every minute
  }

  // Report all metrics
  reportMetrics() {
    const summary: Record<string, any> = {}
    
    // Convert to array to avoid iteration issues
    const entriesArray = Array.from(this.metrics.entries());
    for (let i = 0; i < entriesArray.length; i++) {
      const [name, entries] = entriesArray[i];
      if (entries.length === 0) continue
      
      const values = entries.map(e => e.value)
      summary[name] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        p95: this.percentile(values, 95)
      }
    }
    
    this.sendToMonitoring('metrics_summary', {
      summary,
      timestamp: Date.now(),
      url: window.location.href
    })
  }

  // Calculate percentile
  percentile(arr: number[], p: number) {
    const sorted = arr.slice().sort((a, b) => a - b)
    const index = (p / 100) * (sorted.length - 1)
    
    if (Math.floor(index) === index) {
      return sorted[index]
    }
    
    const lower = sorted[Math.floor(index)]
    const upper = sorted[Math.ceil(index)]
    const weight = index % 1
    
    return lower * (1 - weight) + upper * weight
  }

  // Get current metrics
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  // Clean up observers
  cleanup() {
    // Convert to array to avoid iteration issues
    const observersArray = Array.from(this.observers.values());
    for (let i = 0; i < observersArray.length; i++) {
      const observer = observersArray[i];
      observer.disconnect()
    }
    this.observers.clear()
    this.metrics.clear()
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor()

// Export utilities
export const {
  startTimer,
  endTimer,
  recordMetric,
  reportError,
  getMetrics
} = performanceMonitor

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  performanceMonitor.init()
}

export default performanceMonitor