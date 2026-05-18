// src/components/DashboardCard.jsx
import React from "react";
import { Home, Users, FileText, Package, ShoppingCart } from "lucide-react";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className={`p-5 rounded-xl shadow-sm bg-white border-l-4 ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm text-gray-500">{title}</h4>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
