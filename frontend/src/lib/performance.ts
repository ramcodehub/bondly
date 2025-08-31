"use client"

// Performance monitoring utilities
export class PerformanceMonitor {
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
      entries.forEach((entry) => {
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
    let clsEntries = []
    let sessionValue = 0
    let sessionEntries = []

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0]
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

          if (sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value
            sessionEntries.push(entry)
          } else {
            sessionValue = entry.value
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
      entries.forEach((entry) => {
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
        this.reportError('API Error', error, { url, duration })
        
        throw error
      }
    }
  }

  // Memory usage monitoring
  observeMemoryUsage() {
    if (!('memory' in performance)) return

    setInterval(() => {
      const memory = performance.memory
      
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
  startTimer(name) {
    if (typeof window.performance?.mark !== 'function') return
    
    performance.mark(`${name}-start`)
  }

  endTimer(name) {
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
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    this.metrics.get(name).push({
      value,
      timestamp: Date.now()
    })
    
    // Keep only last 100 entries per metric
    const entries = this.metrics.get(name)
    if (entries.length > 100) {
      entries.splice(0, entries.length - 100)
    }
  }

  // Report slow metrics
  reportSlowMetric(name, value) {
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
  reportError(type, error, metadata = {}) {
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
  sendToMonitoring(type, data) {
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
    const summary = {}
    
    for (const [name, entries] of this.metrics.entries()) {
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
  percentile(arr, p) {
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
    for (const observer of this.observers.values()) {
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