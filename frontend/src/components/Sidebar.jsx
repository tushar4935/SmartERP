import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  ShoppingCart,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    { to: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/hr", label: "HR", icon: Users },
    { to: "/admin/finance", label: "Finance", icon: FileText },
    { to: "/admin/inventory", label: "Inventory", icon: Package },
    { to: "/admin/sales", label: "Sales", icon: ShoppingCart },
  ];

  return (
    <aside className="flex flex-col justify-between bg-gray-900 text-gray-200 w-64 min-h-screen shadow-lg">
      {/* Header */}
      <div>
        <div className="text-center py-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            SmartERP
          </h2>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="flex flex-col gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "hover:bg-gray-800 hover:text-white text-gray-300"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
