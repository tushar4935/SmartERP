import React from 'react';

/**
 * A reusable card for the main dashboard display.
 * @param {string} title - e.g., "Total Revenue", "New Users"
 * @param {string|number} value - e.g., "$45,231", "150"
 * @param {React.ReactNode} [icon] - An optional icon to display.
 */
const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="dashboard-card">
      {icon && <div className="card-icon">{icon}</div>}
      <div className="card-info">
        <h3>{title}</h3>
        <h2>{value}</h2>
      </div>
    </div>
  );
};

export default DashboardCard;