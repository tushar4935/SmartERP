import React, { useEffect, useState } from "react";
import { fetchPayrolls, fetchPayrollInvoice } from "../api/employees";
import { DollarSign, Search, Printer, ClipboardList } from "lucide-react";

export default function PaidSalariesHistory() {
  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [printing, setPrinting] = useState(null);

  useEffect(() => {
    fetchPayrolls()
      .then(d => setList(d.payrolls || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = async (id) => {
    setPrinting(id);
    try {
      const inv = await fetchPayrollInvoice(id);
      const html = `
        <html><head><title>Payroll Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
          h1 { color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .label { color: #64748b; font-size: 14px; }
          .value { font-weight: 600; }
          .amount { font-size: 24px; color: #059669; font-weight: 700; margin-top: 16px; }
        </style>
        </head><body>
          <h1>SmartERP — Payroll Invoice</h1>
          <div class="row"><span class="label">Invoice No</span><span class="value">${inv.invoice_no || id}</span></div>
          <div class="row"><span class="label">Employee</span><span class="value">${inv.employee_name || "—"}</span></div>
          <div class="row"><span class="label">Month</span><span class="value">${inv.salary_month || "—"} ${inv.salary_year || ""}</span></div>
          <div class="row"><span class="label">Processed</span><span class="value">${inv.processed_at ? new Date(inv.processed_at).toLocaleString() : "—"}</span></div>
          <div class="amount">PKR ${Number(inv.paid_amount || 0).toLocaleString()}</div>
        </body></html>`;
      const w = window.open("", "_blank");
      w.document.write(html);
      w.document.close();
      w.print();
    } catch { alert("Print failed"); }
    finally { setPrinting(null); }
  };

  const filtered = list.filter(r =>
    (r.employee_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.invoice_no    || "").toLowerCase().includes(search.toLowerCase()) ||
    String(r.salary_month || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = list.reduce((s, r) => s + Number(r.paid_amount || 0), 0);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ClipboardList size={22} className="text-teal-500" /> Salary History
          </h1>
          <p className="page-sub">{list.length} payroll records</p>
        </div>
        <div className="erp-card px-4 py-3 flex items-center gap-3">
          <DollarSign size={18} className="text-teal-500" />
          <div>
            <p className="text-xs text-slate-500">Total Disbursed</p>
            <p className="font-bold text-slate-800">PKR {totalPaid.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by employee, invoice or month…"
            className="erp-input pl-9"
          />
        </div>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Invoice No</th>
                <th>Month / Year</th>
                <th>Processed</th>
                <th className="text-right">Paid Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    <ClipboardList size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No salary records found.</p>
                  </td>
                </tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{r.employee_name || "—"}</td>
                  <td className="text-indigo-600 font-medium">{r.invoice_no || "—"}</td>
                  <td><span className="badge badge-blue">{r.salary_month} {r.salary_year}</span></td>
                  <td className="text-slate-500 text-sm">
                    {r.processed_at ? new Date(r.processed_at).toLocaleDateString("en-PK") : "—"}
                  </td>
                  <td className="text-right font-bold text-emerald-600">
                    PKR {Number(r.paid_amount || 0).toLocaleString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handlePrint(r.id)}
                      disabled={printing === r.id}
                      className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <Printer size={13} />
                      {printing === r.id ? "…" : "Print"}
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
