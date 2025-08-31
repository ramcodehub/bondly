"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from './supabase-client'
import { notifications } from './notifications'

// Real-time event types
export type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE'

export interface RealtimeEvent<T = any> {
  eventType: RealtimeEventType
  new: T
  old: T
  table: string
  timestamp: string
}

// Real-time subscription configuration
interface SubscriptionConfig {
  table: string
  event?: RealtimeEventType | '*'
  filter?: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  onChange?: (payload: RealtimeEvent) => void
}

// Real-time manager class
class RealtimeManager {
  private client: any = null
  private channels: Map<string, RealtimeChannel> = new Map()
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isInitialized = false
  private connectionStatusCallback: ((status: boolean) => void) | null = null

  constructor() {
    // Delay initialization until client-side
    if (typeof window !== 'undefined') {
      this.initializeClient()
    }
  }

  private initializeClient() {
    if (typeof window === 'undefined' || this.isInitialized) return

    try {
      // Use the existing Supabase client instead of creating a new one
      this.client = supabase
      this.isInitialized = true

      // Set up connection status monitoring
      this.setupConnectionMonitoring()
      console.log('✅ Realtime client initialized')
      
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error)
      this.isConnected = false
      this.isInitialized = false
    }
  }

  private setupConnectionMonitoring() {
    if (!this.client) {
      console.warn('Cannot monitor connection: client not initialized')
      return
    }
    
    try {
      // Listen for auth state changes which can affect realtime connection
      const { data: { subscription } } = this.client.auth.onAuthStateChange((event: any, session: any) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('Auth state changed, reinitializing realtime connections')
          this.reconnect()
        }
      })
      
      // Clean up auth subscription on unmount
      if (subscription) {
        window.addEventListener('beforeunload', () => {
          subscription.unsubscribe()
        })
      }
      
      this.isConnected = true
      this.reconnectAttempts = 0
      this.notifyConnectionStatus(true)
      
    } catch (error) {
      console.error('❌ Error setting up connection monitoring:', error)
      this.isConnected = false
      this.notifyConnectionStatus(false)
    }
  }

  private notifyConnectionStatus(status: boolean) {
    this.isConnected = status
    if (this.connectionStatusCallback) {
      this.connectionStatusCallback(status)
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      
      console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)
      
      setTimeout(() => {
        this.reconnect()
      }, delay)
    } else {
      notifications.error('Connection lost', {
        description: 'Unable to reconnect to real-time updates. Please refresh the page.',
        action: {
          label: 'Refresh',
          onClick: () => window.location.reload()
        }
      })
    }
  }

  // Subscribe to table changes
  subscribe(config: SubscriptionConfig): () => void {
    if (!this.client || !this.isInitialized) {
      console.warn('Realtime client not initialized, attempting to initialize...')
      this.initializeClient()
      
      if (!this.client) {
        console.warn('Realtime client initialization failed')
        return () => {}
      }
    }

    const channelName = `realtime:${config.table}:${Date.now()}`
    
    try {
      const channel = this.client.channel(channelName)

      // Configure subscription
      channel
        .on(
          'postgres_changes',
          {
            event: config.event || '*',
            schema: 'public',
            table: config.table,
            filter: config.filter
          },
          (payload: any) => {
            const realtimeEvent: RealtimeEvent = {
              eventType: payload.eventType,
              new: payload.new,
              old: payload.old,
              table: config.table,
              timestamp: new Date().toISOString()
            }

            // Call specific event handlers
            switch (payload.eventType) {
              case 'INSERT':
                config.onInsert?.(payload)
                break
              case 'UPDATE':
                config.onUpdate?.(payload)
                break
              case 'DELETE':
                config.onDelete?.(payload)
                break
            }

            // Call general change handler
            config.onChange?.(realtimeEvent)
          }
        )
        .subscribe((status: string, error: any) => {
          if (status === 'SUBSCRIBED') {
            console.log(`✅ Subscribed to ${config.table} changes`)
            this.channels.set(channelName, channel)
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`❌ Failed to subscribe to ${config.table}:`, error)
            notifications.error(`Failed to subscribe to ${config.table} updates`)
          } else if (status === 'CLOSED') {
            console.log(`🔌 Unsubscribed from ${config.table}`)
          }
        })

      // Return unsubscribe function
      return () => {
        channel.unsubscribe()
        this.channels.delete(channelName)
        console.log(`🔌 Unsubscribed from ${config.table}`)
      }
    } catch (error) {
      console.error(`❌ Error subscribing to ${config.table}:`, error)
      return () => {}
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      try {
        channel.unsubscribe()
      } catch (error) {
        console.error(`Error unsubscribing from channel ${name}:`, error)
      }
    })
    this.channels.clear()
    console.log('🔌 Unsubscribed from all channels')
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected
  }

  // Set connection status callback
  setConnectionStatusCallback(callback: ((status: boolean) => void) | null) {
    this.connectionStatusCallback = callback
  }

  // Get client instance for external use
  getClient() {
    return this.client
  }

  // Manual reconnect
  reconnect() {
    console.log('🔄 Attempting to reconnect realtime client...')
    
    try {
      // Unsubscribe from all existing channels
      this.unsubscribeAll()
      
      // Reinitialize the client
      this.initializeClient()
      
      console.log('✅ Realtime client reconnected')
      this.reconnectAttempts = 0
    } catch (error) {
      console.error('❌ Error reconnecting realtime client:', error)
      this.handleReconnect()
    }
  }

  // Send real-time message (for notifications)
  async sendMessage(channel: string, message: any) {
    if (!this.client || !this.isConnected) {
      console.warn('Cannot send message: not connected')
      return false
    }

    try {
      const channelRef = this.client.channel(channel)
      await channelRef.send({
        type: 'broadcast',
        event: 'message',
        payload: message
      })
      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      return false
    }
  }
}

// Create singleton instance
const realtimeManager = new RealtimeManager()

// React hook for real-time subscriptions
export function useRealtime<T = any>(config: SubscriptionConfig) {
  const [data, setData] = useState<T[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Set up connection status callback
    realtimeManager.setConnectionStatusCallback(setIsConnected)
    setIsConnected(realtimeManager.getConnectionStatus())

    // Subscribe to changes
    unsubscribeRef.current = realtimeManager.subscribe({
      ...config,
      onChange: (event) => {
        // Update local data based on event type
        switch (event.eventType) {
          case 'INSERT':
            setData(prev => [...prev, event.new])
            notifications.info(`New ${config.table} added`, {
              description: event.new.name || event.new.title || 'Item added'
            })
            break
          case 'UPDATE':
            setData(prev => prev.map(item => 
              (item as any).id === event.new.id ? event.new : item
            ))
            notifications.info(`${config.table} updated`, {
              description: event.new.name || event.new.title || 'Item updated'
            })
            break
          case 'DELETE':
            setData(prev => prev.filter(item => 
              (item as any).id !== event.old.id
            ))
            notifications.info(`${config.table} deleted`, {
              description: event.old.name || event.old.title || 'Item deleted'
            })
            break
        }

        // Call custom onChange handler
        config.onChange?.(event)
      }
    })

    // Cleanup on unmount
    return () => {
      unsubscribeRef.current?.()
      realtimeManager.setConnectionStatusCallback(null)
    }
  }, [config.table, config.event, config.filter])

  return {
    data,
    setData,
    isConnected,
    reconnect: realtimeManager.reconnect.bind(realtimeManager)
  }
}

// Hook for specific table subscriptions
export function useLeadsRealtime() {
  return useRealtime({
    table: 'leads',
    onInsert: (payload) => {
      console.log('New lead:', payload.new)
    },
    onUpdate: (payload) => {
      console.log('Lead updated:', payload.new)
    },
    onDelete: (payload) => {
      console.log('Lead deleted:', payload.old)
    }
  })
}

export function useContactsRealtime() {
  return useRealtime({
    table: 'contacts',
    onInsert: (payload) => {
      console.log('New contact:', payload.new)
    },
    onUpdate: (payload) => {
      console.log('Contact updated:', payload.new)
    },
    onDelete: (payload) => {
      console.log('Contact deleted:', payload.old)
    }
  })
}

export function useOpportunitiesRealtime() {
  return useRealtime({
    table: 'opportunities',
    onInsert: (payload) => {
      console.log('New opportunity:', payload.new)
    },
    onUpdate: (payload) => {
      console.log('Opportunity updated:', payload.new)
    },
    onDelete: (payload) => {
      console.log('Opportunity deleted:', payload.old)
    }
  })
}

// Real-time presence system
export function usePresence(roomId: string) {
  const [presenceState, setPresenceState] = useState<any>({})
  const [myPresence, setMyPresence] = useState<any>({})
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const client = realtimeManager.getClient()
    if (!client) return

    const channel = client.channel(roomId, {
      config: {
        presence: {
          key: 'user_id'
        }
      }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        setPresenceState(channel.presenceState())
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
        console.log('User left:', key, leftPresences)
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [roomId])

  const updatePresence = useCallback((presence: any) => {
    if (channelRef.current) {
      channelRef.current.track(presence)
      setMyPresence(presence)
    }
  }, [])

  return {
    presenceState,
    myPresence,
    updatePresence
  }
}

// Connection status component
export function RealtimeStatus() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Set up connection status callback
    realtimeManager.setConnectionStatusCallback(setIsConnected)
    setIsConnected(realtimeManager.getConnectionStatus())

    // Cleanup callback on unmount
    return () => {
      realtimeManager.setConnectionStatusCallback(null)
    }
  }, [])

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
        Disconnected
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <div className="w-2 h-2 bg-green-600 rounded-full" />
      Live
    </div>
  )
}

export default realtimeManager