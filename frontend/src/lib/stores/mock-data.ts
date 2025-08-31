import { v4 as uuidv4 } from 'uuid'
import { subDays, addDays } from 'date-fns'
import type { 
  Contact, 
  Company, 
  CompanySize, 
  Industry, 
  Deal, 
  DealStage, 
  DealPriority, 
  Task, 
  TaskPriority, 
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
    company: 'Acme Inc',
    position: 'CEO',
    status: 'active',
    notes: 'Interested in enterprise plan',
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Globex Corp',
    position: 'CTO',
    status: 'lead',
    notes: 'Follow up next week',
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Initech',
    position: 'Marketing Director',
    status: 'customer',
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
    revenue: 5000000,
    description: 'Leading provider of innovative solutions',
    phone: '+1 (555) 123-4567',
    email: 'info@acme.com',
    address: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    logo: '/logos/acme.png',
    status: 'customer',
    notes: 'Enterprise customer',
  },
  {
    name: 'Globex Corp',
    website: 'https://globex.com',
    industry: 'Finance' as Industry,
    size: '201-1000' as CompanySize,
    revenue: 25000000,
    description: 'Global financial services',
    phone: '+1 (555) 987-6543',
    email: 'contact@globex.com',
    address: '456 Finance Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    logo: '/logos/globex.png',
    status: 'lead',
    notes: 'In negotiations',
  },
  {
    name: 'Initech',
    website: 'https://initech.com',
    industry: 'Technology' as Industry,
    size: '1000+' as CompanySize,
    revenue: 100000000,
    description: 'Enterprise software solutions',
    phone: '+1 (555) 456-7890',
    email: 'hello@initech.com',
    address: '789 Enterprise Blvd',
    city: 'Austin',
    state: 'TX',
    zipCode: '73301',
    country: 'USA',
    logo: '/logos/initech.png',
    status: 'customer',
    notes: 'Long-term partner',
  },
]

// Mock Deals
export const mockDeals: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Enterprise License',
    amount: 50000,
    stage: 'proposal' as DealStage,
    probability: 70,
    closeDate: addDays(new Date(), 30).toISOString(),
    companyId: '', // Will be set in initialization
    contactId: '', // Will be set in initialization
    ownerId: users[0].id,
    priority: 'high' as DealPriority,
    description: 'Enterprise license for 500 users',
    notes: 'Waiting for legal review',
  },
  {
    name: 'Team Subscription',
    amount: 5000,
    stage: 'qualification' as DealStage,
    probability: 40,
    closeDate: addDays(new Date(), 45).toISOString(),
    companyId: '', // Will be set in initialization
    contactId: '', // Will be set in initialization
    ownerId: users[1].id,
    priority: 'medium' as DealPriority,
    description: 'Team subscription for 20 users',
    notes: 'Needs budget approval',
  },
  {
    name: 'Custom Development',
    amount: 15000,
    stage: 'negotiation' as DealStage,
    probability: 85,
    closeDate: addDays(new Date(), 15).toISOString(),
    companyId: '', // Will be set in initialization
    contactId: '', // Will be set in initialization
    ownerId: users[2].id,
    priority: 'high' as DealPriority,
    description: 'Custom feature development',
    notes: 'Finalizing requirements',
  },
]

// Mock Tasks
export const mockTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'completedAt'>[] = [
  {
    title: 'Follow up with Alice',
    description: 'Discuss enterprise plan details',
    dueDate: addDays(new Date(), 2).toISOString(),
    priority: 'high' as TaskPriority,
    labels: ['follow-up', 'important'],
    companyId: '', // Will be set in initialization
    contactId: '', // Will be set in initialization
    dealId: '', // Will be set in initialization
    assignedTo: [users[0].id],
    createdBy: users[0].id,
  },
  {
    title: 'Prepare proposal for Globex',
    description: 'Draft proposal for enterprise solution',
    dueDate: addDays(new Date(), 5).toISOString(),
    priority: 'high' as TaskPriority,
    labels: ['proposal', 'important'],
    companyId: '', // Will be set in initialization
    contactId: '', // Will be set in initialization
    dealId: '', // Will be set in initialization
    assignedTo: [users[1].id],
    createdBy: users[0].id,
  },
  {
    title: 'Schedule product demo',
    description: 'Show new features to the team',
    dueDate: addDays(new Date(), 3).toISOString(),
    priority: 'medium' as TaskPriority,
    labels: ['demo'],
    companyId: '', // Will be set in initialization
    contactId: '', // Will be set in initialization
    assignedTo: [users[2].id],
    createdBy: users[1].id,
  },
]

// Initialize stores with mock data
export const initializeMockData = () => {
  const { addContact, getContacts } = useContactsStore.getState()
  const { addCompany, getCompanies } = useCompaniesStore.getState()
  const { addDeal, getDeals } = useDealsStore.getState()
  const { addTask, getTasks } = useTasksStore.getState()

  // Only initialize if stores are empty
  if (getContacts().length === 0) {
    mockContacts.forEach(contact => addContact(contact))
  }

  if (getCompanies().length === 0) {
    mockCompanies.forEach(company => addCompany(company))
  }

  // Get company and contact IDs for relationships
  const companies = getCompanies()
  const contacts = getContacts()

  if (getDeals().length === 0) {
    const dealsWithRelationships = mockDeals.map((deal, index) => ({
      ...deal,
      companyId: companies[index % companies.length].id,
      contactId: contacts[index % contacts.length].id,
    }))
    
    dealsWithRelationships.forEach(deal => addDeal(deal))
  }

  if (getTasks().length === 0) {
    const deals = getDeals()
    
    const tasksWithRelationships = mockTasks.map((task, index) => ({
      ...task,
      companyId: companies[index % companies.length].id,
      contactId: contacts[index % contacts.length].id,
      dealId: deals[index % deals.length]?.id,
    }))
    
    tasksWithRelationships.forEach(task => addTask(task))
  }
}

// Export a function to reset all stores to initial mock data
export const resetAllStores = () => {
  useContactsStore.getState().$reset?.()
  useCompaniesStore.getState().$reset?.()
  useDealsStore.getState().$reset?.()
  useTasksStore.getState().$reset?.()
  
  // Re-initialize with mock data
  initializeMockData()
}
