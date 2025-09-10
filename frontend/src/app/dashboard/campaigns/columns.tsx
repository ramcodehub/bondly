'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Campaign } from './types';

const statusVariantMap: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-800',
  'in progress': 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const typeVariantMap: Record<string, string> = {
  email: 'bg-blue-100 text-blue-800',
  'social media': 'bg-purple-100 text-purple-800',
  webinar: 'bg-green-100 text-green-800',
  event: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
};

export const campaignColumns: ColumnDef<Campaign>[] = [
  {
    accessorKey: 'campaign_name',
    header: 'Name',
    cell: ({ row }: { row: { original: Campaign } }) => {
      const campaign = row.original;
      return (
        <div className="font-medium">
          <Link href={`/dashboard/campaigns/${campaign.campaign_id}`} className="hover:underline">
            {campaign.campaign_name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }: { row: { original: Campaign } }) => {
      const campaign = row.original;
      const type = campaign.type?.toLowerCase() || 'other';
      return (
        <Badge className={typeVariantMap[type] || 'bg-gray-100 text-gray-800'}>
          {campaign.type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: Campaign } }) => {
      const campaign = row.original;
      const status = campaign.status?.toLowerCase() || 'planned';
      return (
        <Badge className={statusVariantMap[status] || 'bg-gray-100 text-gray-800'}>
          {campaign.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }: { row: { original: Campaign } }) => {
      const campaign = row.original;
      const date = campaign.start_date ? new Date(campaign.start_date) : null;
      return date ? date.toLocaleDateString() : 'N/A';
    },
  },
  {
    accessorKey: 'number_of_leads',
    header: 'Leads',
  },
  {
    accessorKey: 'number_of_responses',
    header: 'Responses',
  },
  {
    accessorKey: 'roi',
    header: 'ROI',
    cell: ({ row }: { row: { original: Campaign } }) => {
      const campaign = row.original;
      if (campaign.actual_cost && campaign.expected_revenue) {
        const roi = ((campaign.expected_revenue - campaign.actual_cost) / campaign.actual_cost) * 100;
        return (
          <span className={roi >= 0 ? 'text-green-600' : 'text-red-600'}>
            {roi.toFixed(2)}%
          </span>
        );
      }
      return 'N/A';
    },
  },
  {
    id: 'actions',
    cell: ({ row }: { row: { original: Campaign } }) => {
      const campaign = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/campaigns/${campaign.campaign_id}`}>View/Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm('Are you sure you want to delete this campaign?')) {
                  fetch(`/api/extended/campaigns/${campaign.campaign_id}`, {
                    method: 'DELETE',
                  })
                    .then((res) => res.json())
                    .then(() => {
                      window.location.reload();
                    })
                    .catch(console.error);
                }
              }}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];