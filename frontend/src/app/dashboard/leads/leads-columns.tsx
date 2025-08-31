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
import { Lead } from './types';

const statusVariantMap: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
  qualified: 'bg-green-100 text-green-800',
  unqualified: 'bg-red-100 text-red-800',
};

export const leadColumns: ColumnDef<Lead>[] = [
  {
    accessorKey: 'first_name',
    header: 'Name',
    cell: ({ row }: { row: { original: Lead } }) => {
      const lead = row.original;
      return (
        <div className="font-medium">
          {lead.first_name} {lead.last_name}
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'company',
    header: 'Company',
  },
  {
    accessorKey: 'source',
    header: 'Source',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: Lead } }) => {
      const lead = row.original;
      const status = lead.status || 'new';
      return (
        <Badge className={statusVariantMap[status] || 'bg-gray-100 text-gray-800'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }: { row: { original: Lead } }) => {
      const lead = row.original;
      const date = lead.created_at ? new Date(lead.created_at) : null;
      return date ? date.toLocaleDateString() : 'N/A';
    },
  },
  {
    id: 'actions',
    cell: ({ row }: { row: { original: Lead } }) => {
      const lead = row.original;

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
              <Link href={`/dashboard/leads/${lead.id}`}>View/Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm('Are you sure you want to delete this lead?')) {
                  fetch(`/api/leads/${lead.id}`, {
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
