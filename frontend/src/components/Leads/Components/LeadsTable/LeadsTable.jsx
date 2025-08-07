import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import './LeadsTable.css';
import LeadData from '../LeadData/LeadData';
import { request } from '../../../../services/apiService';

// Fallback mock data in case API fails
const mockLeads = [
  {
    id: 1,
    name: 'Christopher Maclead (Sample)',
    company: 'Rangoni Of Florence',
    email: 'christopher-email.invalid',
    phone: '9876543210',
    leadOwner: 'Hari Shankar Bhaskar',
    leadSource: 'Website',
    isToday: false,
  },
  {
    id: 2,
    name: 'Carissa Kidman (Sample)',
    company: 'Oh My Goodknits Inc',
    email: 'carissa-kidman.invalid',
    phone: '9123456780',
    leadOwner: 'Hari Shankar Bhaskar',
    leadSource: 'Referral',
    isToday: true,
  },
  {
    id: 3,
    name: 'James Merced (Sample)',
    company: 'Kwik Kopy Printing',
    email: 'james-merced.invalid',
    phone: '9988776655',
    leadOwner: 'Hari Shankar Bhaskar',
    leadSource: 'Google Ads',
    isToday: false,
  },
  {
    id: 4,
    name: 'Felix Hirpara (Sample)',
    company: 'Chapman',
    email: 'felix-hirpara.invalid',
    phone: '9112233445',
    leadOwner: 'Hari Shankar Bhaskar',
    leadSource: 'LinkedIn',
    isToday: true,
  },
];

const LeadsTable = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await request('/leads');
        if (response && Array.isArray(response)) {
          setLeads(response);
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to fetch leads. Using mock data instead.');
        // Keep using mock data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);
  return (
    <>
      {loading && <div className="loading-message">Loading leads...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
    <div className="table-wrapper">
      <table className="leads-table">
        
          <thead>
            <tr>
            <th><input type="checkbox" /></th>
            <th>Lead Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Lead Source</th>
            <th>LeadOwner</th>
          </tr>
          </thead>
          <tbody>
          {leads.map((lead) => (

            <tr key={lead.id}>
              <td><input type="checkbox" /></td>
              <td>
                {lead.isToday && (
                  <span className="today-badge">
                    <i className="bi bi-calendar-event-fill"></i>
                    Today
                  </span>
                )}
                <Link to='/leads/profile' onClick={()=><LeadData name={lead.name}/>}>{lead.name}</Link>
              </td>
              <td>{lead.company}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.leadSource}</td>
              <td>{lead.leadOwner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )}
    </>
  );
};

export default LeadsTable;
