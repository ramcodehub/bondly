export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'

export interface Deal {
  id: string
  name: string
  amount: number
  company?: string
  contact?: string
  stage: DealStage
  probability: number
  closeDate?: string
  close_date?: string
  description?: string
  companyIndustry?: string
  contactEmail?: string
  contactPhone?: string
  lead_id?: string
  contact_id?: string
  account_id?: string
  owner_id?: string
  deal_source?: string
  competitors?: string[]
  next_step?: string
  created_at?: string
  updated_at?: string
  created_by?: string
}

export interface DealColumn {
  id: DealStage
  title: string
  deals: Deal[]
}
