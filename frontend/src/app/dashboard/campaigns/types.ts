export interface Campaign {
  campaign_id: number;
  campaign_name: string;
  type: 'Email' | 'Social Media' | 'Webinar' | 'Event' | 'Other';
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  start_date: string;
  end_date?: string;
  budgeted_cost?: number;
  actual_cost?: number;
  expected_revenue?: number;
  number_of_leads: number;
  number_of_responses: number;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignFormValues {
  campaign_name: string;
  type: string;
  status: string;
  start_date: string;
  end_date?: string;
  budgeted_cost?: number;
  actual_cost?: number;
  expected_revenue?: number;
}

export interface CampaignWithStats extends Campaign {
  roi?: number;
  cost_per_lead?: number;
  response_rate?: number;
}