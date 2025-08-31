"use client"

import { useEffect, useState, useCallback } from 'react'
import realtimeManager from '@/lib/realtime'
import supabase from '@/lib/supabase-client'
import { notifications } from '@/lib/notifications'

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company_name: string
  status: "active" | "inactive" | "lead"
  lastContact: string
  created_at?: string
  updated_at?: string
}

interface ContactsRealtimeState {
  contacts: Contact[]
  loading: boolean
  error: string | null
  stats: {
    totalContacts: number
    statusBreakdown: Record<string, number>
    recentContacts: Contact[]
    companiesCount: number
  }
}

export function useContactsRealtime() {
  const [state, setState] = useState<ContactsRealtimeState>({
    contacts: [],
    loading: true,
    error: null,
    stats: {
      totalContacts: 0,
      statusBreakdown: {},
      recentContacts: [],
      companiesCount: 0
    }
  })

  // Calculate stats from contacts array
  const calculateStats = useCallback((contacts: Contact[]) => {
    const stats = {
      totalContacts: contacts.length,
      statusBreakdown: {} as Record<string, number>,
      recentContacts: contacts.slice(0, 5),
      companiesCount: 0
    }

    // Calculate breakdowns
    const companies = new Set<string>()
    
    contacts.forEach(contact => {
      // Status breakdown
      const status = contact.status || 'unknown'
      stats.statusBreakdown[status] = (stats.statusBreakdown[status] || 0) + 1
      
      // Companies count
      if (contact.company_name) {
        companies.add(contact.company_name)
      }
    })

    stats.companiesCount = companies.size

    return stats
  }, [])

  // Fetch initial contacts data
  const fetchContacts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const stats = calculateStats(data || [])

      setState(prev => ({
        ...prev,
        contacts: data || [],
        stats,
        loading: false,
        error: null
      }))

    } catch (error) {
      console.error('Error fetching contacts:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contacts'
      }))
    }
  }, [calculateStats])

  // Optimistic update for creating contact
  const createContact = useCallback(async (contactData: Partial<Contact>) => {
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticContact: Contact = {
        id: tempId,
        name: contactData.name || '',
        email: contactData.email || '',
        phone: contactData.phone || '',
        company_name: contactData.company_name || '',
        status: contactData.status || 'active',
        lastContact: contactData.lastContact || new Date().toISOString(),
        ...contactData
      } as Contact

      setState(prev => {
        const newContacts = [optimisticContact, ...prev.contacts]
        return {
          ...prev,
          contacts: newContacts,
          stats: calculateStats(newContacts)
        }
      })

      // Actual API call
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      })

      if (!response.ok) {
        throw new Error('Failed to create contact')
      }

      const result = await response.json()
      
      // Replace optimistic update with real data
      setState(prev => {
        const newContacts = prev.contacts.map(contact => 
          contact.id === tempId ? result.data : contact
        )
        return {
          ...prev,
          contacts: newContacts,
          stats: calculateStats(newContacts)
        }
      })

      notifications.success('Contact created successfully')
      return result.data

    } catch (error) {
      // Remove optimistic update on error
      setState(prev => {
        const newContacts = prev.contacts.filter(contact => !contact.id.startsWith('temp-'))
        return {
          ...prev,
          contacts: newContacts,
          stats: calculateStats(newContacts)
        }
      })
      
      notifications.error('Failed to create contact')
      throw error
    }
  }, [calculateStats])

  // Optimistic update for updating contact
  const updateContact = useCallback(async (contactId: string, updates: Partial<Contact>) => {
    try {
      // Optimistic update
      setState(prev => {
        const newContacts = prev.contacts.map(contact => 
          contact.id === contactId ? { ...contact, ...updates } : contact
        )
        return {
          ...prev,
          contacts: newContacts,
          stats: calculateStats(newContacts)
        }
      })

      // Actual API call
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update contact')
      }

      const result = await response.json()
      
      // Update with real data
      setState(prev => {
        const newContacts = prev.contacts.map(contact => 
          contact.id === contactId ? result.data : contact
        )
        return {
          ...prev,
          contacts: newContacts,
          stats: calculateStats(newContacts)
        }
      })

      notifications.success('Contact updated successfully')
      return result.data

    } catch (error) {
      // Revert optimistic update on error
      fetchContacts()
      notifications.error('Failed to update contact')
      throw error
    }
  }, [calculateStats, fetchContacts])

  // Optimistic update for deleting contact
  const deleteContact = useCallback(async (contactId: string) => {
    // Save current state for rollback
    const originalContacts = state.contacts
    
    try {
      // Optimistic update
      setState(prev => {
        const newContacts = prev.contacts.filter(contact => contact.id !== contactId)
        return {
          ...prev,
          contacts: newContacts,
          stats: calculateStats(newContacts)
        }
      })

      // Actual API call
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }

      notifications.success('Contact deleted successfully')

    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        contacts: originalContacts,
        stats: calculateStats(originalContacts)
      }))
      
      notifications.error('Failed to delete contact')
      throw error
    }
  }, [state.contacts, calculateStats])

  // Set up realtime subscription
  useEffect(() => {
    // Initial fetch
    fetchContacts()

    // Subscribe to realtime changes
    const unsubscribe = realtimeManager.subscribe({
      table: 'contacts',
      onChange: (event) => {
        console.log('Contacts realtime event:', event)
        
        if (event.eventType === 'INSERT') {
          setState(prev => {
            // Avoid duplicates from optimistic updates
            if (prev.contacts.find(contact => contact.id === event.new.id)) {
              return prev
            }
            const newContacts = [event.new, ...prev.contacts]
            return {
              ...prev,
              contacts: newContacts,
              stats: calculateStats(newContacts)
            }
          })
          notifications.info('New contact added', {
            description: event.new.name
          })
        } else if (event.eventType === 'UPDATE') {
          setState(prev => {
            const newContacts = prev.contacts.map(contact => 
              contact.id === event.new.id ? event.new : contact
            )
            return {
              ...prev,
              contacts: newContacts,
              stats: calculateStats(newContacts)
            }
          })
          notifications.info('Contact updated', {
            description: event.new.name
          })
        } else if (event.eventType === 'DELETE') {
          setState(prev => {
            const newContacts = prev.contacts.filter(contact => contact.id !== event.old.id)
            return {
              ...prev,
              contacts: newContacts,
              stats: calculateStats(newContacts)
            }
          })
          notifications.info('Contact deleted', {
            description: event.old.name
          })
        }
      }
    })

    return unsubscribe
  }, [fetchContacts, calculateStats])

  return {
    ...state,
    refetch: fetchContacts,
    createContact,
    updateContact,
    deleteContact
  }
}