import React, { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import { fetchUsers } from '../api/api'; // Import api function

export default function HRPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
      setLoading(false);
    };
    loadUsers();
  }, []);

  return (
    <div className="module-page">
      <h2>HR Management Module</h2>
      <p>Manage employees, departments, attendance, and payroll here.</p>
      {loading ? <p>Loading users...</p> : <UserTable users={users} />}
    </div>
  );
}
