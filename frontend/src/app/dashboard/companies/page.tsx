"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const DataTable = dynamic(() => import("@/components/ui/data-table.client"), { ssr: false });
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Company } from "./types";
import { createCompanyColumns } from "./columns";
import CompanyForm from "./company-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

async function fetchCompanies(): Promise<Company[]> {
  try {
    const response = await fetch('/api/companies');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
}

async function createCompany(companyData: Partial<Company>): Promise<Company> {
  try {
    const response = await fetch('/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

async function updateCompany(id: string, companyData: Partial<Company>): Promise<Company> {
  try {
    const response = await fetch(`/api/companies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
}

async function deleteCompanyById(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/companies/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
}



export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load companies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreateCompany = async (companyData: Partial<Company>) => {
    setFormLoading(true);
    try {
      await createCompany(companyData);
      toast({
        title: "Success",
        description: "Company created successfully.",
      });
      setIsFormOpen(false);
      await loadCompanies();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create company.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCompany = async (companyData: Partial<Company>) => {
    if (!editingCompany) return;
    
    setFormLoading(true);
    try {
      await updateCompany(editingCompany.id, companyData);
      toast({
        title: "Success",
        description: "Company updated successfully.",
      });
      setEditingCompany(null);
      await loadCompanies();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update company.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;
    
    try {
      await deleteCompanyById(companyToDelete.id);
      toast({
        title: "Success",
        description: "Company deleted successfully.",
      });
      setCompanyToDelete(null);
      await loadCompanies();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete company.",
        variant: "destructive",
      });
    }
  };

  const columns = createCompanyColumns({
    onEdit: (company) => setEditingCompany(company),
    onDelete: (company) => setCompanyToDelete(company),
    onView: (company) => {
      // TODO: Implement view details modal or navigation
      console.log('View company:', company);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">
            Manage your companies and view their details
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCompanies} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={companies}
        searchKey="name"
      />

      {/* Add Company Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          <CompanyForm
            onSubmit={handleCreateCompany}
            onCancel={() => setIsFormOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={!!editingCompany} onOpenChange={(open) => !open && setEditingCompany(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editingCompany && (
            <CompanyForm
              initialData={editingCompany}
              onSubmit={handleEditCompany}
              onCancel={() => setEditingCompany(null)}
              isEditing
              loading={formLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!companyToDelete} onOpenChange={(open: boolean) => !open && setCompanyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {companyToDelete?.name} and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
