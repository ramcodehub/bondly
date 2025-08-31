export interface LeadScore {
  score_id?: number;
  score: number;
  qualification_status: string;
  notes?: string;
  updated_at: string;
}

export interface Lead {
  id: string; // UUID
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string; // UUID
  lead_scores?: LeadScore[];
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
  [key: string]: any;
}
