import React from 'react';
import DashboardCard from '../components/DashboardCard';

export default function AdminDashboard() {
  return (
    <div className="dashboard-grid">
      <DashboardCard title="HR Management" link="/admin/hr" />
      <DashboardCard title="Finance" link="/admin/finance" />
      {/* The typo was here. I've fixed the self-closing tag. */}
      <DashboardCard title="Inventory" link="/admin/inventory" />
      <DashboardCard title="Sales" link="/admin/sales" />
      <DashboardCard title="Purchases" link="/admin/purchases" />
    </div>
  );
}

