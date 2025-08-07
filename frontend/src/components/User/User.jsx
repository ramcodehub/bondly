import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';

const User = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: '',
    name: '',
    role: ''
  });
  const [editingId, setEditingId] = useState(null);

  const API = 'http://localhost:8000/users1';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API + '/');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({
      email: '',
      name: '',
      role: ''
    });
    setEditingId(null);
  };

  const handleCreate = async () => {
    if (!form.email || !form.name || !form.role) {
      alert('All fields are required');
      return;
    }

    try {
      await axios.post(`${API}/`, form);
      clearForm();
      fetchUsers();
    } catch (err) {
      alert('Error creating user');
      console.error(err);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.user_id);
    setForm({
      email: user.email,
      name: user.name,
      role: user.role
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/${editingId}`, form);
      clearForm();
      fetchUsers();
    } catch (err) {
      alert('Error updating user');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }} className='user'>
      <h2>User Manager</h2>

      <input
        type="text"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="role"
        placeholder="Role"
        value={form.role}
        onChange={handleChange}
      />

      {editingId ? (
        <>
          <button onClick={handleUpdate}>Update User</button>
          <button onClick={clearForm} style={{ marginLeft: '10px' }}>Cancel</button>
        </>
      ) : (
        <button onClick={handleCreate}>Add User</button>
      )}

      <hr />

      <h3>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            {user.email} — {user.name} — {user.role}
            <button onClick={() => startEdit(user)} style={{ marginLeft: '10px' }}>Edit</button>
            <button onClick={() => handleDelete(user.user_id)} style={{ marginLeft: '5px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
