import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Creation = () => {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    lead_owner: '',
    lead_source: '',
  });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setOwners([]);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/leads', form);
      alert('Lead created successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className='w-full px-4 sm:px-6 lg:px-8 pt-14 md:pt-16'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg shadow-sm p-6 sm:p-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900'>Create Lead</h3>
            <a href='' className='text-blue-600 hover:text-blue-800 text-sm font-medium'>Edit the Layout</a>
          </div>

          <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
              <p className='text-sm font-medium text-gray-700'>Lead Image:</p>
              <i className='bi bi-person-circle text-4xl text-gray-400'></i>
            </div>
            
            <div>
              <p className='text-sm font-medium text-gray-700 mb-4'>Lead Information:</p>
            </div>

            <form id="lead-form" className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' onSubmit={handleSubmit}>
              <div className='sm:col-span-2 lg:col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Name *</label>
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  required
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div className='sm:col-span-2 lg:col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Company</label>
                <input
                  type='text'
                  name='company'
                  value={form.company}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div className='sm:col-span-2 lg:col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div className='sm:col-span-2 lg:col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
                <input
                  type='tel'
                  name='phone'
                  value={form.phone}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div className='sm:col-span-2 lg:col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Lead Source</label>
                <input
                  type='text'
                  name='lead_source'
                  value={form.lead_source}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div className='sm:col-span-2 lg:col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Lead Owner</label>
                <input
                  type='text'
                  name='lead_owner'
                  value={form.lead_owner}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </form>

            {error && <p className='text-red-600 text-sm'>{error}</p>}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 justify-end mt-6'>
          <button 
            type='button' 
            onClick={() => setForm({})}
            className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
          >
            Cancel
          </button>
          <button 
            type='button' 
            onClick={() => setForm({ ...form })}
            className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
          >
            Save and New
          </button>
          <button 
            type='submit' 
            form='lead-form'
            className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Creation;