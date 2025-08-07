import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../../shared-ui/src'
import { apiService } from '../services/apiService'

const HomePage = () => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHello = async () => {
      try {
        setLoading(true)
        const data = await apiService.getHello()
        setMessage(data.message)
      } catch (err) {
        console.error('Error fetching hello message:', err)
        setError('Failed to connect to the backend. Please make sure the server is running.')
      } finally {
        setLoading(false)
      }
    }

    fetchHello()
  }, [])

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Welcome to Travels App</h1>
        <p className="lead">Your complete travel management solution</p>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <Card>
            <h2>Manage Leads</h2>
            <p>Track and manage all your travel leads in one place.</p>
            <Link to="/leads" className="btn btn-primary">View Leads</Link>
          </Card>
        </div>
        
        <div className="col-md-6 mb-4">
          <Card>
            <h2>Backend Connection</h2>
            {loading ? (
              <p>Connecting to backend...</p>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="alert alert-success">
                <strong>Backend says:</strong> {message}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomePage