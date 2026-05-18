import { useEffect, useState } from "react";
import { fetchAccountSubControls } from "../../../api/accountSubControls";
import { useNavigate } from "react-router-dom";
import { GitBranch, Plus } from "lucide-react";

export default function AccountSubControlsList() {
  const navigate = useNavigate();
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchAccountSubControls()
      .then(d => setRows(Array.isArray(d) ? d : d.subControls || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <GitBranch size={22} className="text-teal-500" /> Account Sub Controls
          </h1>
          <p className="page-sub">Third-level chart of accounts</p>
        </div>
        <button onClick={() => navigate("/admin/account-sub-controls/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Sub Control
        </button>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr><th>#</th><th>Head Account</th><th>Control Account</th><th>Sub Control</th><th>Created By</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-slate-400">
                    <GitBranch size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No sub controls found.</p>
                  </td>
                </tr>
              ) : rows.map((r, i) => (
                <tr key={r.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="text-slate-600">{r.head_account || "—"}</td>
                  <td className="text-slate-600">{r.control_account || "—"}</td>
                  <td className="font-semibold">{r.sub_control_account}</td>
                  <td className="text-slate-500">{r.user_email || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
