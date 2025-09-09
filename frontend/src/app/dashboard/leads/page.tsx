'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { leadColumns } from './leads-columns';
import { Lead } from './types';
import { ErrorDisplay } from './components/error-display';
import DebugAPI from './debug-api';

function LeadsPage() {
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true);
        const response = await fetch('/api/leads');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch leads: ${response.status}`);
        }
        
        const result = await response.json();
        // Handle both response formats
        const leadsData = result.data || result || [];
        setData(Array.isArray(leadsData) ? leadsData : []);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch leads');
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Leads</h1>
          <Button asChild>
            <Link href="/dashboard/leads/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Link>
          </Button>
        </div>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button asChild>
          <Link href="/dashboard/leads/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Link>
        </Button>
      </div>
      
      {error ? (
        <ErrorDisplay 
          message={`Error loading leads: ${error}. Please check your connection and try again.`}
        />
      ) : data.length === 0 ? (
        <div>
          <DebugAPI />
          <ErrorDisplay 
            message="No leads found. This could be due to a connection issue or no leads have been created yet."
          />
        </div>
      ) : (
        <div>
          <DebugAPI />
          <DataTable
            columns={leadColumns}
            data={data}
            searchKey="email"
            filterOptions={[
              {
                label: "Status",
                value: "status",
                options: [
                  { label: "New", value: "new" },
                  { label: "Contacted", value: "contacted" },
                  { label: "Qualified", value: "qualified" },
                  { label: "Unqualified", value: "unqualified" },
                ],
              },
              {
                label: "Source",
                value: "source",
                options: [
                  { label: "Website", value: "website" },
                  { label: "Referral", value: "referral" },
                  { label: "Social Media", value: "social_media" },
                  { label: "Event", value: "event" },
                  { label: "Other", value: "other" },
                ],
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

export default LeadsPage;