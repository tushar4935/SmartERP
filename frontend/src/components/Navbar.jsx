import { Bell } from "lucide-react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin" };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-600 hover:text-blue-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
            3
          </span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="user avatar"
            className="w-9 h-9 rounded-full border border-gray-300"
          />
          <div>
            <p className="text-sm font-medium text-gray-700 leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
