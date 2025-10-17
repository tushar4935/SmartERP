import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {
  const [role, setRole] = useState(null); // null, "admin", or "employee"

  // Simple "login" simulation
  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Welcome to SmartERP</h1>

        {/* If no role selected, show login buttons */}
        {!role && (
          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => handleLogin("admin")}>Login as Admin</button>{" "}
            <button onClick={() => handleLogin("employee")}>Login as Employee</button>
          </div>
        )}

        {/* Navigation only visible after login */}
        {role && (
          <nav style={{ marginBottom: "20px" }}>
            <Link to="/admin">Admin Dashboard</Link> |{" "}
            <Link to="/employee">Employee Dashboard</Link>{" "}
            <button onClick={() => setRole(null)}>Logout</button>
          </nav>
        )}

        <Routes>
          {/* Redirect user to their dashboard based on role */}
          <Route
            path="/admin"
            element={role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/employee"
            element={role === "employee" ? <EmployeeDashboard /> : <Navigate to="/" />}
          />
          <Route path="/" element={!role ? <h2>Please select your role to login</h2> : <Navigate to={role === "admin" ? "/admin" : "/employee"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
