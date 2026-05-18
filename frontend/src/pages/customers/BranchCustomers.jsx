import { useEffect, useState } from "react";
import { fetchCustomers } from "../../api/customers";
import BranchSelector from "./components/BranchSelector";
import { UserCheck, Search } from "lucide-react";

export default function BranchCustomers() {
  const [branch, setBranch]       = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (!branch) return;
    setLoading(true);
    fetchCustomers({ type: "branch", branch })
      .then(d => setCustomers(Array.isArray(d) ? d : d.customers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [branch]);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <UserCheck size={22} className="text-emerald-500" /> Branch Customers
          </h1>
          <p className="page-sub">Filter customers by branch</p>
        </div>
      </div>

      <div className="erp-card p-5 animate-slideInLeft">
        <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
          <Search size={15} /> Select Branch
        </label>
        <div className="max-w-xs">
          <BranchSelector value={branch} onChange={setBranch} />
        </div>
      </div>

      {branch && (
        <div className="erp-card overflow-hidden animate-slideInRight">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
            </div>
          ) : (
            <table className="erp-table">
              <thead>
                <tr><th>#</th><th>Customer</th><th>Contact</th><th>Area</th><th>Assigned User</th></tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-400">No customers in this branch.</td></tr>
                ) : customers.map((c, i) => (
                  <tr key={c.id}>
                    <td className="text-slate-400 text-xs">{i + 1}</td>
                    <td className="font-semibold">{c.customer_name}</td>
                    <td className="text-slate-500">{c.contact_no || "—"}</td>
                    <td className="text-slate-500">{c.area || "—"}</td>
                    <td className="text-slate-500">{c.assigned_user_name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
