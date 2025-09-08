// Common types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high';

// Contact types
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId?: string;
  position?: string;
  status: Status;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Company types
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
export type Industry = 
  | 'Technology' 
  | 'Finance' 
  | 'Healthcare' 
  | 'Education' 
  | 'Retail' 
  | 'Manufacturing' 
  | 'Other';

export interface Company {
  id: string;
  name: string;
  industry: Industry;
  size: CompanySize;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Deal types
export type DealStage = 
  | 'prospect' 
  | 'qualification' 
  | 'proposal' 
  | 'negotiation' 
  | 'closed_won' 
  | 'closed_lost';

export interface Deal {
  id: string;
  name: string;
  amount: number;
  stage: DealStage;
  status: 'active' | 'won' | 'lost';
  probability: number;
  companyId?: string;
  contactId?: string;
  expectedCloseDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Task types
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  completedAt?: string;
  assignedTo?: string;
  relatedTo?: {
    type: 'deal' | 'contact' | 'company';
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Base store interface
interface BaseStore<T, F = string> {
  items: T[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  filter?: F;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter?: (filter: F) => void;
}

// Store interfaces with specific methods
export interface CompanyStore extends BaseStore<Company, 'all' | Industry> {
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Company;
  updateCompany: (id: string, updates: Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCompany: (id: string) => void;
  setSelectedCompany: (id: string | null) => void;
  getCompany: (id: string) => Company | undefined;
  getCompaniesByIndustry: (industry: Industry) => Company[];
  setFilter: (filter: 'all' | Industry) => void;
  getFilteredCompanies: () => Company[];
}

export interface ContactStore extends BaseStore<Contact, 'all' | Status> {
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact;
  updateContact: (id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteContact: (id: string) => void;
  setSelectedContact: (id: string | null) => void;
  getContact: (id: string) => Contact | undefined;
  getContactsByStatus: (status: Status) => Contact[];
  setFilter: (filter: 'all' | Status) => void;
  getFilteredContacts: () => Contact[];
}

export interface DealsStore extends BaseStore<Deal, 'all' | DealStage> {
  currentStage: DealStage;
  addDeal: (deal: Omit<Deal, 'id' | 'status' | 'probability' | 'createdAt' | 'updatedAt'> & { probability?: number }) => Deal;
  updateDeal: (id: string, updates: Partial<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteDeal: (id: string) => void;
  setSelectedDeal: (id: string | null) => void;
  updateDealStage: (id: string, stage: DealStage) => void;
  setCurrentStage: (stage: DealStage) => void;
  getDeal: (id: string) => Deal | undefined;
  getDealsByStage: (stage: DealStage) => Deal[];
  getTotalValue: () => number;
  getTotalValueByStage: (stage: DealStage) => number;
  setFilter: (filter: 'all' | DealStage) => void;
  getFilteredDeals: () => Deal[];
}

export interface TaskStore extends BaseStore<Task, 'all' | TaskStatus> {
  addTask: (task: Omit<Task, 'id' | 'status' | 'completedAt' | 'createdAt' | 'updatedAt'> & { status?: TaskStatus }) => Task;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (id: string | null) => void;
  toggleTaskStatus: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByPriority: (priority: Priority) => Task[];
  setFilter: (filter: 'all' | TaskStatus) => void;
  getFilteredTasks: () => Task[];
}

// New store interfaces
export interface Interaction {
  id: string;
  contact_id: number;
  type: string;
  description: string;
  created_at: string;
  created_by: string;
}

export interface InteractionStore extends BaseStore<Interaction, 'all' | string> {
  addInteraction: (interaction: Omit<Interaction, 'id' | 'created_at' | 'created_by'> & { created_by?: string }) => Interaction;
  updateInteraction: (id: string, updates: Partial<Omit<Interaction, 'id' | 'created_at' | 'created_by'>>) => void;
  deleteInteraction: (id: string) => void;
  setSelectedInteraction: (id: string | null) => void;
  getInteraction: (id: string) => Interaction | undefined;
  getInteractionsByContact: (contactId: number) => Interaction[];
  setFilter: (filter: 'all' | string) => void;
  getFilteredInteractions: () => Interaction[];
}

export interface Transaction {
  id: string;
  company_id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

export interface TransactionStore extends BaseStore<Transaction, 'all' | string> {
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'created_at'>>) => void;
  deleteTransaction: (id: string) => void;
  setSelectedTransaction: (id: string | null) => void;
  getTransaction: (id: string) => Transaction | undefined;
  getTransactionsByCompany: (companyId: string) => Transaction[];
  setFilter: (filter: 'all' | string) => void;
  getFilteredTransactions: () => Transaction[];
}

export interface ServiceStage {
  id: string;
  company_id: string;
  stage: string; // onboarding, engagement, retention, advocacy
  details: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceLifecycleStore extends BaseStore<ServiceStage, 'all' | string> {
  addServiceStage: (stage: Omit<ServiceStage, 'id' | 'created_at' | 'updated_at'>) => ServiceStage;
  updateServiceStage: (id: string, updates: Partial<Omit<ServiceStage, 'id' | 'created_at' | 'updated_at'>>) => void;
  deleteServiceStage: (id: string) => void;
  setSelectedServiceStage: (id: string | null) => void;
  getServiceStage: (id: string) => ServiceStage | undefined;
  getServiceStagesByCompany: (companyId: string) => ServiceStage[];
  getServiceStageByType: (companyId: string, stageType: string) => ServiceStage | undefined;
  setFilter: (filter: 'all' | string) => void;
  getFilteredServiceStages: () => ServiceStage[];
}

// Root state type
type RootState = {
  companies: CompanyStore;
  contacts: ContactStore;
  deals: DealsStore;
  tasks: TaskStore;
  interactions: InteractionStore;
  transactions: TransactionStore;
  serviceLifecycle: ServiceLifecycleStore;
  resetAll: () => void;
  hydrate: (data: Partial<RootState>) => void;
};

export type { RootState };

// Helper types for component props
export type WithStoreProps = {
  store: {
    companies: CompanyStore;
    contacts: ContactStore;
    deals: DealsStore;
    tasks: TaskStore;
    interactions: InteractionStore;
    transactions: TransactionStore;
    serviceLifecycle: ServiceLifecycleStore;
  };
};
