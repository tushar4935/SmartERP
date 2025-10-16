import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);     // Store users from backend
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null);     // Error message

  useEffect(() => {
    // Change the port (5000) if your backend runs on a different one
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => {
        setUsers(res.data);      // Store response data
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);   // Capture any error
        setLoading(false);
      });
  }, []); // Run once on page load

  if (loading) return <h2>Loading users...</h2>;
  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>SmartERP Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <strong>{user.name}</strong> – {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
