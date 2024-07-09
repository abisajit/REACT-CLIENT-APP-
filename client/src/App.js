import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', phone: '', address: '' });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axios.get('http://localhost:5000/users');
    setUsers(response.data);
  };

  const addUser = async () => {
    const response = await axios.post('http://localhost:5000/users', form);
    setUsers([...users, response.data]);
    setForm({ name: '', age: '', phone: '', address: '' });
  };

  const updateUser = async (index) => {
    const response = await axios.put(`http://localhost:5000/users/${index}`, form);
    const updatedUsers = users.map((user, idx) => (idx === index ? response.data : user));
    setUsers(updatedUsers);
    setEditIndex(null);
    setForm({ name: '', age: '', phone: '', address: '' });
  };

  const deleteUser = async (index) => {
    await axios.delete(`http://localhost:5000/users/${index}`);
    const updatedUsers = users.filter((_, idx) => idx !== index);
    setUsers(updatedUsers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editIndex === null ? addUser() : updateUser(editIndex);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(users[index]);
  };

  return (
    <div>
      <h1>CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <button type="submit">{editIndex === null ? 'Add' : 'Update'}</button>
      </form>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name}, {user.age}, {user.phone}, {user.address}
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => deleteUser(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
