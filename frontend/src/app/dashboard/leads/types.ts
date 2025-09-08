export interface LeadScore {
  score_id?: number;
  score: number;
  qualification_status: string;
  notes?: string;
  updated_at: string;
}

export interface LeadNurturingAction {
  id: number;
  lead_id: number;
  action_type: 'email' | 'call' | 'follow-up' | string;
  action_date: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled' | string;
}

export interface Lead {
  id: string; // UUID
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source?: 'website' | 'referral' | 'ads' | 'event' | 'other' | string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | string;
  notes?: string;
  score?: number;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string; // UUID
  lead_scores?: LeadScore[];
  lead_nurturing?: LeadNurturingAction[];
  // Additional attributes
  [key: string]: any;
}

export interface LeadFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source?: string;
  status: string;
  notes?: string;
  score?: number;
  [key: string]: any;
}