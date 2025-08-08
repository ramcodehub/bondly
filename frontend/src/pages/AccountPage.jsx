import { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'

const AccountPage = () => {
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true)
        const data = await apiService.getAccounts()
        setAccount(data[0] || null) // Get first account for demo
      } catch (err) {
        console.error('Error fetching account:', err)
        setError('Failed to fetch account details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAccount()
  }, [])

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-14 md:pt-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Account Details</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>
      ) : account ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Name</label>
                <p className="mt-1 text-sm text-gray-900">{account.account_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <p className="mt-1 text-sm text-gray-900">{account.industry || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <p className="mt-1 text-sm text-gray-900">
                  {account.website ? (
                    <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {account.website}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <p className="mt-1 text-sm text-gray-900">
                  {account.contact_email ? (
                    <a href={`mailto:${account.contact_email}`} className="text-blue-600 hover:text-blue-800">
                      {account.contact_email}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Logo</h2>
            {account.logo_url ? (
              <img 
                src={account.logo_url} 
                alt="Account Logo" 
                className="w-32 h-32 object-contain rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No logo</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
          No account details found.
        </div>
      )}
    </div>
  )
}

export default AccountPage


