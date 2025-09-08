import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { leadService } from '../../../../lib/supabase';
import { toast } from 'react-toastify';

const LeadDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const data = await leadService.getLeadById(id);
        setLead(data);
      } catch (err) {
        console.error('Error fetching lead:', err);
        setError('Failed to load lead details');
        toast.error('Failed to load lead');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLead();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await leadService.deleteLead(id);
        toast.success('Lead deleted successfully');
        router.push('/leads');
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">
            <i className="bi bi-exclamation-circle"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lead Not Found</h3>
          <p className="text-gray-500 mb-6">The requested lead could not be found or you don't have permission to view it.</p>
          <Link
            href="/leads"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{lead.name}</h1>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <i className="bi bi-building mr-1.5"></i>
              {lead.company || 'No company'}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <i className="bi bi-envelope mr-1.5"></i>
              {lead.email || 'No email'}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <i className="bi bi-telephone mr-1.5"></i>
              {lead.phone || 'No phone'}
            </div>
          </div>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <Link
            href={`/leads/edit/${lead.id}`}
            className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i className="bi bi-pencil mr-2"></i>
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <i className="bi bi-trash mr-2"></i>
            Delete
          </button>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Lead Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.job_title || '-'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Lead Source</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.lead_source || '-'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${lead.status === 'New' ? 'bg-green-100 text-green-800' : 
                      lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {lead.status || 'New'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(lead.created_at)}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(lead.updated_at)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {lead.description && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">{lead.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDetail;