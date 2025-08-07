import { useState, useEffect } from 'react'
import { Table } from '@shared-ui/components/Table'
import { Button } from '@shared-ui/components/Button'
import { apiService } from '../services/apiService'

const LeadsPage = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        const data = await apiService.getLeads()
        setLeads(data)
      } catch (err) {
        console.error('Error fetching leads:', err)
        setError('Failed to fetch leads. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  // Mock data for when backend is not available
  const mockLeads = [
    {
      id: 1,
      name: 'Christopher Maclead',
      company: 'Rangoni Of Florence',
      email: 'christopher@example.com',
      phone: '9876543210',
      lead_owner: 'Hari Shankar',
      lead_source: 'Website',
    },
    {
      id: 2,
      name: 'Carissa Kidman',
      company: 'Oh My Goodknits Inc',
      email: 'carissa@example.com',
      phone: '9123456780',
      lead_owner: 'Hari Shankar',
      lead_source: 'Referral',
    },
  ]

  // Use mock data if backend connection fails
  const displayLeads = leads.length > 0 ? leads : mockLeads

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Leads Management</h1>
        <Button variant="success">Create Lead</Button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Lead Source</th>
              <th>Lead Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayLeads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.company}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>{lead.lead_source}</td>
                <td>{lead.lead_owner}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">View</Button>
                  <Button variant="warning" size="sm" className="me-2">Edit</Button>
                  <Button variant="danger" size="sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default LeadsPage