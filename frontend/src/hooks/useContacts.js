import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';

export const useContacts = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [accountId, setAccountId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch contacts with pagination and search
  const {
    data: contactsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['contacts', { page, limit, search, accountId }],
    queryFn: () => apiService.getContacts({ page, limit, search, accountId }),
    keepPreviousData: true,
  });

  // Create contact mutation
  const createContactMutation = useMutation({
    mutationFn: (contactData) => apiService.createContact(contactData),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    },
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: ({ id, ...contactData }) => apiService.updateContact(id, contactData),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: (id) => apiService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    },
  });

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setPage(1); // Reset to first page on new search
  };

  // Handle account filter change
  const handleAccountFilter = (accountId) => {
    setAccountId(accountId);
    setPage(1); // Reset to first page when filter changes
  };

  // Create contact
  const createContact = async (contactData) => {
    try {
      return await createContactMutation.mutateAsync(contactData);
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  };

  // Update contact
  const updateContact = async (id, contactData) => {
    try {
      return await updateContactMutation.mutateAsync({ id, ...contactData });
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    try {
      await deleteContactMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  return {
    contacts: contactsData?.data || [],
    pagination: contactsData?.pagination || {
      total: 0,
      page,
      limit,
      totalPages: 0,
    },
    isLoading,
    error,
    page,
    limit,
    search,
    accountId,
    setPage: handlePageChange,
    setLimit,
    setSearch: handleSearch,
    setAccountId: handleAccountFilter,
    refetch,
    createContact,
    updateContact,
    deleteContact,
    isCreating: createContactMutation.isLoading,
    isUpdating: updateContactMutation.isLoading,
    isDeleting: deleteContactMutation.isLoading,
  };
};

export const useContact = (id) => {
  const queryClient = useQueryClient();

  // Fetch single contact
  const {
    data: contact,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contact', id],
    queryFn: () => apiService.getContactById(id),
    enabled: !!id,
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: (contactData) => apiService.updateContact(id, contactData),
    onSuccess: () => {
      queryClient.invalidateQueries(['contact', id]);
      queryClient.invalidateQueries(['contacts']);
    },
  });

  // Update contact
  const updateContact = async (contactData) => {
    try {
      return await updateContactMutation.mutateAsync(contactData);
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  return {
    contact,
    isLoading,
    error,
    updateContact,
    isUpdating: updateContactMutation.isLoading,
  };
};
