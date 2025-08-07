import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Creation.css';

const Creation = () => {
  const [form, setForm] = useState({
    title: 'Mr.',
    first_name: '',
    last_name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    lead_owner_email: '',
    date_created: ''
  });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/lead-owners/')
      .then(res => setOwners(res.data))
      .catch(err => console.error('Failed to fetch owners', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:8000/leads/', form);
      alert('Lead created successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'Submission failed');
    }
  };

  return (
    <div className='main-content'>
      <div className='creation'>
        <div className='head'>
          <h3>Create Lead</h3>
          <a href=''>Edit the Layout</a>
        </div>
      </div>

      <div className='form'>
        <div className='lead-info'>
          <p>Lead Image :</p>
          <i className='bi bi-person-circle'></i>
        </div>
        <div className='lead-info'>
          <p>Lead Information :</p>
        </div>

        <form id="lead-form" className='grid-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Lead Owner Email</label>
            <input
              type='email'
              name='lead_owner_email'
              value={form.lead_owner_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group firstname-group'>
            <label>First Name</label>
            <div className='firstname-inputs'>
              <select
                className='title-select'
                name='title'
                value={form.title}
                onChange={handleChange}
              >
                <option>Mr.</option>
                <option>Mrs.</option>
                <option>Ms.</option>
                <option>Dr.</option>
                <option>Prof.</option>
              </select>
              <input
                type='text'
                name='first_name'
                value={form.first_name}
                onChange={handleChange}
                placeholder='First Name'
                required
              />
            </div>
          </div>

          <div className='form-group'>
            <label>Last Name</label>
            <input
              type='text'
              name='last_name'
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label>Company</label>
            <input
              type='text'
              name='company'
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Phone</label>
            <input
              type='tel'
              name='phone'
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Website</label>
            <input
              type='text'
              name='website'
              value={form.website}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Date Created</label>
            <input
              type='date'
              name='date_created'
              value={form.date_created}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>

      <div className='savebtn'>
        <button type='button' onClick={() => setForm({})}>Cancel</button>
        <button type='button' onClick={() => setForm({ ...form })}>Save and New</button>
        <button type='submit' form='lead-form' style={{ backgroundColor: 'blue' }} className='save'>Save</button>
      </div>
    </div>
  );
};

export default Creation;