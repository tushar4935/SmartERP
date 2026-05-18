import { useEffect, useState } from "react";
import { fetchAccountFlows } from "../../../api/accountFlows";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Plus, Edit2 } from "lucide-react";

export default function AccountFlowList() {
  const navigate = useNavigate();
  const [flows, setFlows]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchAccountFlows()
      .then(d => setFlows(Array.isArray(d) ? d : d.flows || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ArrowLeftRight size={22} className="text-rose-500" /> Account Flows
          </h1>
          <p className="page-sub">Map activities to chart of accounts</p>
        </div>
        <button onClick={() => navigate("/admin/account-flows/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Flow
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
              <tr><th>#</th><th>Activity</th><th>Head</th><th>Control</th><th>Sub Control</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {flows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <ArrowLeftRight size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No account flows found.</p>
                  </td>
                </tr>
              ) : flows.map((f, i) => (
                <tr key={f.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{f.activity}</td>
                  <td className="text-slate-600">{f.head_account || "—"}</td>
                  <td className="text-slate-600">{f.control_account || "—"}</td>
                  <td className="text-slate-600">{f.sub_control_account || "—"}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/account-flows/${f.id}/edit`)}
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
