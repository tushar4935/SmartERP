import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Dashboard from "./pages/Dashboard";

// Hub pages
import HRPage from "./pages/HRPage";
import FinancePage from "./pages/FinancePage";
import InventoryPage from "./pages/InventoryPage";
import SalesPage from "./pages/SalesPage";

// Employees — these files live in pages/ not pages/admin/
// FIX: removed imports of ManageEmployees/EmployeeCreate/EmployeeView/EmployeeEdit
// from pages/admin/ because those files don't exist there.
// Using the actual files that exist: pages/ManageEmployees and pages/EmployeeRegistration.
import ManageEmployees from "./pages/ManageEmployees";
import EmployeeRegistration from "./pages/EmployeeRegistration";
import EmployeeForm from "./pages/admin/EmployeeForm";
import EmployeeView from "./pages/admin/EmployeeView";
import Payroll from "./pages/Payroll";
import PaidSalariesHistory from "./pages/PaidSalariesHistory";

// Branches
import BranchesList from "./pages/BranchesList";
import BranchForm from "./pages/BranchForm";
import BranchUsersList from "./pages/BranchUsersList";

// User Types / Users
import UserTypes from "./pages/admin/UserTypes";
import Users from "./pages/admin/Users";

// Companies
import CompaniesList from "./pages/admin/CompaniesList";
import CompanyRegistration from "./pages/admin/CompanyRegistration";
import CompanyView from "./pages/admin/CompanyView";
import CompanyEdit from "./pages/admin/CompanyEdit";

// Account Heads / Financial Years
import AccountHeadsList from "./pages/admin/AccountHeadsList";
import AccountHeadEdit from "./pages/admin/AccountHeadEdit";
import FinancialYearsList from "./pages/admin/FinancialYearsList";
import FinancialYearEdit from "./pages/admin/FinancialYearEdit";

// Suppliers
import SuppliersList from "./pages/admin/SuppliersList";
import SupplierEdit from "./pages/admin/SupplierEdit";

// Customers
import CustomersList from "./pages/admin/CustomersList";
import CustomerEdit from "./pages/admin/CustomerEdit";

// Account chart of accounts
import AccountControlsList from "./pages/admin/account/AccountControlsList";
import AccountControlForm from "./pages/admin/account/AccountControlForm";
import AccountSubControlsList from "./pages/admin/account/AccountSubControlsList";
import AccountSubControlForm from "./pages/admin/account/AccountSubControlForm";
import AccountFlowList from "./pages/admin/account/AccountFlowList";
import AccountFlowForm from "./pages/admin/account/AccountFlowForm";

// Stock
import StockCategories from "./pages/admin/stock/StockCategories";
import StockDetails from "./pages/admin/stock/StockDetails";

// Accounting reports
import NewTransaction from "./pages/accounting/NewTransaction";
import Ledger from "./pages/accounting/Ledger";
// FIX: file was named " TrialBalance.jsx" (leading space) — renamed to TrialBalance.jsx
import TrialBalance from "./pages/accounting/TrialBalance";
import IncomeStatement from "./pages/accounting/IncomeStatement";
import BalanceSheet from "./pages/accounting/BalanceSheet";
import Journal from "./pages/accounting/Journal";

// Sales pages
import NewSale from "./pages/sales/NewSale";
import AllSales from "./pages/sales/AllSales";
import PendingPayments from "./pages/sales/PendingPayments";
import SaleReturns from "./pages/sales/SaleReturns";
import ReturnPending from "./pages/sales/ReturnPending";

// Purchase pages
import NewPurchase from "./pages/purchase/NewPurchase";
import PurchaseList from "./pages/purchase/PurchaseList";
import PendingPurchases from "./pages/purchase/PendingPurchases";
import PurchaseReturn from "./pages/purchase/PurchaseReturn";
import PendingReturns from "./pages/purchase/PendingReturns";

// Customer pages
import NewCustomer from "./pages/customers/NewCustomer";
import BranchCustomers from "./pages/customers/BranchCustomers";
import SubBranchCustomers from "./pages/customers/SubBranchCustomers";
import CustomerLedger from "./pages/customers/CustomerLedger";

// Supplier pages
import NewSupplier from "./pages/suppliers/NewSupplier";
import BranchSuppliers from "./pages/suppliers/BranchSuppliers";
import SubBranchSuppliers from "./pages/suppliers/SubBranchSuppliers";
import SupplierList from "./pages/suppliers/SupplierList";

const getInitialRoute = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return "/login";
  try {
    const parsed = JSON.parse(storedUser);
    return parsed.role === "admin" ? "/admin-dashboard" : "/employee-dashboard";
  } catch {
    localStorage.removeItem("user");
    return "/login";
  }
};

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes wrapped in Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboards */}
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Hub pages */}
        <Route path="admin/hr" element={<HRPage />} />
        <Route path="admin/finance" element={<FinancePage />} />
        <Route path="admin/inventory" element={<InventoryPage />} />
        <Route path="admin/sales" element={<SalesPage />} />

        {/* User Types & Users */}
        <Route path="admin/user-types" element={<UserTypes />} />
        <Route path="admin/users" element={<Users />} />

        {/* Employees */}
        <Route path="admin/employees" element={<ManageEmployees />} />
        <Route path="admin/employees/new" element={<EmployeeForm />} />
        <Route path="admin/employees/:id" element={<EmployeeView />} />
        <Route path="admin/employees/:id/edit" element={<EmployeeForm />} />
        <Route path="employees" element={<EmployeeRegistration />} />
        <Route path="employees/payroll" element={<Payroll />} />
        <Route path="employees/salary-history" element={<PaidSalariesHistory />} />

        {/* Branches */}
        <Route path="branches" element={<BranchesList />} />
        <Route path="branches/new" element={<BranchForm />} />
        <Route path="branches/:id/edit" element={<BranchForm />} />
        <Route path="branch-users" element={<BranchUsersList />} />

        {/* Companies */}
        <Route path="admin/companies" element={<CompaniesList />} />
        <Route path="admin/company-registration" element={<CompanyRegistration />} />
        <Route path="admin/company/:id" element={<CompanyView />} />
        <Route path="admin/company/:id/edit" element={<CompanyEdit />} />

        {/* Account Heads */}
        <Route path="admin/account-heads" element={<AccountHeadsList />} />
        <Route path="admin/account-heads/new" element={<AccountHeadEdit />} />
        <Route path="admin/account-heads/:id/edit" element={<AccountHeadEdit />} />

        {/* Financial Years */}
        <Route path="admin/financial-years" element={<FinancialYearsList />} />
        <Route path="admin/financial-years/new" element={<FinancialYearEdit />} />
        <Route path="admin/financial-years/:id/edit" element={<FinancialYearEdit />} />

        {/* Suppliers */}
        <Route path="admin/suppliers" element={<SuppliersList />} />
        <Route path="admin/suppliers/new" element={<SupplierEdit />} />
        <Route path="admin/suppliers/:id/edit" element={<SupplierEdit />} />
        <Route path="suppliers" element={<SupplierList />} />
        <Route path="suppliers/new" element={<NewSupplier />} />
        <Route path="suppliers/branch" element={<BranchSuppliers />} />
        <Route path="suppliers/sub-branch" element={<SubBranchSuppliers />} />

        {/* Customers */}
        <Route path="admin/customers" element={<CustomersList />} />
        <Route path="admin/customers/new" element={<CustomerEdit />} />
        <Route path="admin/customers/:id/edit" element={<CustomerEdit />} />
        <Route path="customers/new" element={<NewCustomer />} />
        <Route path="customers/branch" element={<BranchCustomers />} />
        <Route path="customers/sub-branch" element={<SubBranchCustomers />} />
        <Route path="customers/ledger" element={<CustomerLedger />} />

        {/* Account Chart of Accounts */}
        <Route path="admin/account-controls" element={<AccountControlsList />} />
        <Route path="admin/account-controls/new" element={<AccountControlForm />} />
        <Route path="admin/account-controls/:id/edit" element={<AccountControlForm />} />
        <Route path="admin/account-sub-controls" element={<AccountSubControlsList />} />
        <Route path="admin/account-sub-controls/new" element={<AccountSubControlForm />} />
        <Route path="admin/account-flows" element={<AccountFlowList />} />
        <Route path="admin/account-flows/new" element={<AccountFlowForm />} />
        <Route path="admin/account-flows/:id/edit" element={<AccountFlowForm />} />

        {/* Stock */}
        <Route path="admin/stock" element={<StockCategories />} />
        <Route path="admin/stock/:categoryId" element={<StockDetails />} />

        {/* Accounting reports */}
        <Route path="accounting/new" element={<NewTransaction />} />
        <Route path="accounting/ledger" element={<Ledger />} />
        <Route path="accounting/trial-balance" element={<TrialBalance />} />
        <Route path="accounting/income" element={<IncomeStatement />} />
        <Route path="accounting/balance-sheet" element={<BalanceSheet />} />
        <Route path="accounting/journal" element={<Journal />} />

        {/* Sales */}
        <Route path="sales/new" element={<NewSale />} />
        <Route path="sales" element={<AllSales />} />
        <Route path="sales/pending" element={<PendingPayments />} />
        <Route path="sales/returns" element={<SaleReturns />} />
        <Route path="sales/returns/pending" element={<ReturnPending />} />

        {/* Purchases */}
        <Route path="purchases/new" element={<NewPurchase />} />
        <Route path="purchases" element={<PurchaseList />} />
        <Route path="purchases/pending" element={<PendingPurchases />} />
        <Route path="purchases/return" element={<PurchaseReturn />} />
        <Route path="purchases/returns/pending" element={<PendingReturns />} />

        {/* Default redirect */}
        <Route index element={<Navigate to={getInitialRoute()} replace />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
    </Routes>
  );
}
