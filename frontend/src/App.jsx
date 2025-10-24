// ------------------------------------------------------
// 🌟 SmartERP - Main App Router (React 18 + Tailwind v4)
// ------------------------------------------------------
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

// --------------------------------------------
// ✅ App Component
// Handles routing and user role-based redirects
// --------------------------------------------
export default function App() {
  // Function: decide which route to open by default
  const getInitialRoute = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "/login";

    try {
      const parsed = JSON.parse(storedUser);
      return parsed.role === "admin"
        ? "/admin-dashboard"
        : "/employee-dashboard";
    } catch {
      // If parsing fails, clear bad data and go to login
      localStorage.removeItem("user");
      return "/login";
    }
  };

  return (
    <Routes>
      
      {/* 🌐 Public route (no login needed) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 🔒 Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* 🧭 Admin Routes */}
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="admin/hr" element={<HRPage />} />
        <Route path="admin/finance" element={<FinancePage />} />
        <Route path="admin/inventory" element={<InventoryPage />} />
        <Route path="admin/sales" element={<SalesPage />} />

        {/* 👥 Employee Routes */}
        <Route path="employee-dashboard" element={<EmployeeDashboard />} />

        {/* 🏠 Default route after login */}
        <Route index element={<Navigate to={getInitialRoute()} replace />} />
      </Route>

      {/* 🚧 Fallback (for invalid URLs) */}
      <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
    </Routes>
  );
}
