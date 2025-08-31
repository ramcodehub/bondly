"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Company } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  CircleDollarSign,
  Globe,
  MoreHorizontal,
  Users,
  Pencil,
  Trash2,
  Eye,
  Mail,
  Phone
} from "lucide-react";

interface CompanyColumnsProps {
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  onView: (company: Company) => void;
}

export const createCompanyColumns = ({
  onEdit,
  onDelete,
  onView
}: CompanyColumnsProps): ColumnDef<Company>[] => [
  {
    accessorKey: "name",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">{company.name}</div>
            {company.website && (
              <div className="text-sm text-muted-foreground">
                {company.website}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => {
      const industry = row.original.industry;
      return industry ? (
        <span className="text-sm">{industry}</span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = row.original.size;
      return size ? (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{size} employees</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => {
      const revenue = row.original.revenue;
      return revenue ? (
        <div className="flex items-center space-x-2">
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{revenue}</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusVariant = () => {
        switch (status) {
          case 'active':
            return 'default';
          case 'prospect':
            return 'secondary';
          case 'inactive':
            return 'outline';
          default:
            return 'outline';
        }
      };

      return (
        <Badge variant={getStatusVariant()}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex items-center space-x-2">
          {company.email && (
            <a
              href={`mailto:${company.email}`}
              className="text-blue-600 hover:text-blue-800"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
          {company.phone && (
            <a
              href={`tel:${company.phone}`}
              className="text-blue-600 hover:text-blue-800"
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
          {company.website && (
            <a
              href={`https://${company.website.replace(/^https?:\/\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return date ? (
        <span className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const company = row.original;

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
            <DropdownMenuItem onClick={() => onView(company)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(company)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit company
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(company)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete company
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];