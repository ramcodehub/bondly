import { v4 as uuidv4 } from 'uuid'
import { subDays, addDays } from 'date-fns'
import type { 
  Contact, 
  Company, 
  CompanySize, 
  Industry, 
  Deal, 
  DealStage, 
  Priority,
  Task, 
  TaskStatus 
} from '.'

// Helper function to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Mock Users
const users = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', avatar: '/avatars/1.png' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', avatar: '/avatars/2.png' },
  { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', avatar: '/avatars/3.png' },
]

// Mock Contacts
export const mockContacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    companyId: '', // Changed from company to companyId
    position: 'CEO',
    status: 'active',
    notes: 'Interested in enterprise plan',
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael@example.com',
    phone: '+1 (555) 987-6543',
    companyId: '', // Changed from company to companyId
    position: 'CTO',
    status: 'pending', // Changed from lead to pending
    notes: 'Follow up next week',
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 456-7890',
    companyId: '', // Changed from company to companyId
    position: 'Marketing Director',
    status: 'active', // Changed from customer to active
    notes: 'VIP client',
  },
]

// Mock Companies
export const mockCompanies: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Acme Inc',
    website: 'https://acme.com',
    industry: 'Technology' as Industry,
    size: '51-200' as CompanySize,
    // Removed revenue field as it doesn't exist in the Company interface
    notes: 'Leading provider of innovative solutions',
    phone: '+1 (555) 123-4567',
    email: 'info@acme.com',
    address: '123 Tech Street'
  },
  {
    name: 'Globex Corp',
    website: 'https://globex.com',
    industry: 'Finance' as Industry,
    size: '201-1000' as CompanySize,
    // Removed revenue field as it doesn't exist in the Company interface
    notes: 'Global financial services',
    phone: '+1 (555) 987-6543',
    email: 'contact@globex.com',
    address: '456 Finance Ave'
  },
  {
    name: 'Initech',
    website: 'https://initech.com',
    industry: 'Technology' as Industry,
    size: '1000+' as CompanySize,
    // Removed revenue field as it doesn't exist in the Company interface
    notes: 'Enterprise software solutions',
    phone: '+1 (555) 456-7890',
    email: 'hello@initech.com',
    address: '789 Enterprise Blvd'
  },
]

// Mock Deals
export const mockDeals: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'status'>[] = [
  {
    name: 'Enterprise License',
    amount: 50000,
    stage: 'proposal' as DealStage,
    probability: 70,
    expectedCloseDate: addDays(new Date(), 30).toISOString(), // Changed from closeDate to expectedCloseDate
    companyId: '', // Will be set in initialization
    contactId: '', // Will be set in initialization
    notes: 'Waiting for legal review',
  },
  {
    name: 'Team Subscription',
    amount: 5000,
    stage: 'qualification' as DealStage,
    probability: 40,
    expectedCloseDate: addDays(new Date(), 45).toISOString(), // Changed from closeDate to expectedCloseDate
    companyId: '', // Will be set in initialization
    contactId: '', // Will be set in initialization
    notes: 'Needs budget approval',
  },
  {
    name: 'Custom Development',
    amount: 15000,
    stage: 'negotiation' as DealStage,
    probability: 85,
    expectedCloseDate: addDays(new Date(), 15).toISOString(), // Changed from closeDate to expectedCloseDate
    companyId: '', // Will be set in initialization
    contactId: '', // Will be set in initialization
    notes: 'Finalizing requirements',
  },
]

// Mock Tasks
export const mockTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'completedAt'>[] = [
  {
    title: 'Follow up with Alice',
    description: 'Discuss enterprise plan details',
    dueDate: addDays(new Date(), 2).toISOString(),
    priority: 'high' as Priority,
    assignedTo: users[0].id, // Changed from array to string
    relatedTo: {
      type: 'contact',
      id: ''
    },
  },
  {
    title: 'Prepare proposal for Globex',
    description: 'Draft proposal for enterprise solution',
    dueDate: addDays(new Date(), 5).toISOString(),
    priority: 'high' as Priority,
    assignedTo: users[1].id, // Changed from array to string
    relatedTo: {
      type: 'company',
      id: ''
    },
  },
  {
    title: 'Schedule product demo',
    description: 'Show new features to the team',
    dueDate: addDays(new Date(), 3).toISOString(),
    priority: 'medium' as Priority,
    assignedTo: users[2].id, // Changed from array to string
    relatedTo: {
      type: 'deal',
      id: ''
    },
  },
]

// Initialization function to set up relationships
export const initializeMockData = () => {
  // Set up contact-company relationships
  mockContacts[0].companyId = 'company-1'
  mockContacts[1].companyId = 'company-2'
  mockContacts[2].companyId = 'company-3'

  // Set up deal relationships
  mockDeals[0].companyId = 'company-1'
  mockDeals[0].contactId = 'contact-1'
  mockDeals[1].companyId = 'company-2'
  mockDeals[1].contactId = 'contact-2'
  mockDeals[2].companyId = 'company-3'
  mockDeals[2].contactId = 'contact-3'

  // Set up task relationships
  mockTasks[0].relatedTo = {
    type: 'contact',
    id: 'contact-1'
  }
  mockTasks[1].relatedTo = {
    type: 'company',
    id: 'company-2'
  }
  mockTasks[2].relatedTo = {
    type: 'deal',
    id: 'deal-3'
  }
}
