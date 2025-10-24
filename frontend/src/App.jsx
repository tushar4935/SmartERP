// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HRPage from "./pages/HRPage";
import FinancePage from "./pages/FinancePage";
import InventoryPage from "./pages/InventoryPage";
import SalesPage from "./pages/SalesPage";

export default function App() {
  // ✅ Helper to detect user role for default redirects
  const getInitialRoute = () => {
    const user = localStorage.getItem("user");
    if (!user) return "/login";

    const parsedUser = JSON.parse(user);
    return parsedUser.role === "admin"
      ? "/admin-dashboard"
      : "/employee-dashboard";
  };

  return (
    <Routes>
      {/* Public route: Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* ✅ Admin Routes */}
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="admin/hr" element={<HRPage />} />
        <Route path="admin/finance" element={<FinancePage />} />
        <Route path="admin/inventory" element={<InventoryPage />} />
        <Route path="admin/sales" element={<SalesPage />} />
        {/* ✅ Employee Routes */}
        <Route path="employee-dashboard" element={<EmployeeDashboard />} />

        {/* ✅ Default route after login */}
        <Route index element={<Navigate to={getInitialRoute()} replace />} />
      </Route>

      {/* ✅ Fallback route for undefined URLs */}
      <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
    </Routes>
  );
}
