import { useEffect, useState } from "react";
import { fetchAccountControls } from "../../../api/accountControls";
import { useNavigate } from "react-router-dom";
import { Layers, Plus, Edit2 } from "lucide-react";

export default function AccountControlsList() {
  const navigate = useNavigate();
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchAccountControls()
      .then(d => setData(Array.isArray(d) ? d : d.controls || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Layers size={22} className="text-indigo-500" /> Account Controls
          </h1>
          <p className="page-sub">Second-level chart of accounts</p>
        </div>
        <button onClick={() => navigate("/admin/account-controls/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Control
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
              <tr><th>#</th><th>Head Account</th><th>Control Account</th><th>Created By</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-slate-400">
                    <Layers size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No account controls found.</p>
                  </td>
                </tr>
              ) : data.map((row, i) => (
                <tr key={row.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="text-slate-600">{row.head_account || "—"}</td>
                  <td className="font-semibold">{row.control_account}</td>
                  <td className="text-slate-500">{row.user_email || "—"}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/account-controls/${row.id}/edit`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
