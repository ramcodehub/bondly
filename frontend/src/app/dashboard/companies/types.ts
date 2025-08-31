export interface Company {
  id: string; // UUID
  name: string;
  industry?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  revenue?: string;
  website?: string;
  status: 'active' | 'inactive' | 'prospect';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  description?: string;
  logo_url?: string;
  founded_year?: number;
  created_at?: string;
  updated_at?: string;
  // Additional attributes
  [key: string]: any;
}

export interface CompanyFormValues {
  name: string;
  industry?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  revenue?: string;
  website?: string;
  status: 'active' | 'inactive' | 'prospect';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  description?: string;
  logo_url?: string;
  founded_year?: number;
  [key: string]: any;
}

// Constants for dropdown options
export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
] as const;

export const COMPANY_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'inactive', label: 'Inactive' },
] as const;

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Real Estate',
  'Construction',
  'Transportation',
  'Energy',
  'Media',
  'Consulting',
  'Legal',
  'Non-profit',
  'Government',
  'Agriculture',
  'Food & Beverage',
  'Entertainment',
  'Telecommunications',
  'Other'
] as const;