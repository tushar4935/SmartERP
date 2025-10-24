import React from 'react';

/**
 * A table for displaying and managing users in SmartERP.
 * @param {Array} users - Array of user objects from your database.
 * @param {Function} onEdit - Handler to open an edit modal for a user.
 * @param {Function} onDelete - Handler to trigger the user deletion API call.
 */
const UserTable = ({ users = [], onEdit, onDelete }) => {
  if (!users.length) {
    return <p>No user data available.</p>;
  }

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td className="actions">
              <button className="edit-btn" onClick={() => onEdit(user)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;