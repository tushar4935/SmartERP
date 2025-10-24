// ------------------------------------------
// 🌟 SmartERP - Tailwind Admin Dashboard
// Beautiful responsive design using Tailwind CSS
// ------------------------------------------
import {
  Users,
  FileText,
  Package,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  // Sample metrics
  const stats = [
    { label: "Total Employees", value: 124, icon: Users, color: "bg-blue-500" },
    { label: "Pending Invoices", value: 18, icon: FileText, color: "bg-yellow-500" },
    { label: "Active Inventory", value: 86, icon: Package, color: "bg-green-500" },
    { label: "Monthly Sales", value: "$42,300", icon: ShoppingCart, color: "bg-purple-500" },
  ];

  // Chart data
  const salesData = [
    { name: "HR", Sales: 4500 },
    { name: "Finance", Sales: 8000 },
    { name: "Inventory", Sales: 6700 },
    { name: "Sales", Sales: 12000 },
    { name: "Purchase", Sales: 5000 },
  ];

  // Recent activities
  const activities = [
    "🧾 New invoice generated for Tushar (₹15,000)",
    "📦 Inventory updated: Laptops +10 units",
    "👤 New employee added: Moni",
    "💰 Salary processed for October",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-5">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <BarChart3 size={26} className="text-blue-600" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white shadow-sm rounded-lg p-5 flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color} text-white`}>
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Department Sales Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {activities.map((item, i) => (
              <li
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-700 text-sm hover:bg-gray-100 transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
