import React, { useState } from "react";
import { processPayroll, fetchEmployees } from "../api/employees";
import { DollarSign, Search, User, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function Payroll() {
  const [cnic, setCnic]             = useState("");
  const [employee, setEmployee]     = useState(null);
  const [paidAmount, setPaidAmount] = useState("");
  const [salaryMonth, setSalaryMonth] = useState("");
  const [salaryYear, setSalaryYear] = useState(new Date().getFullYear());
  const [searching, setSearching]   = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSearch = async () => {
    if (!cnic.trim()) { showToast("Enter a CNIC to search", "error"); return; }
    setSearching(true);
    try {
      const data = await fetchEmployees();
      const emp  = (data.employees || []).find(e => (e.cnic || "").includes(cnic.trim()));
      if (!emp) { showToast("Employee not found with this CNIC", "error"); setEmployee(null); }
      else { setEmployee(emp); setPaidAmount(emp.salary || ""); }
    } catch { showToast("Search failed", "error"); }
    finally { setSearching(false); }
  };

  const handleProcess = async () => {
    if (!employee)      { showToast("Select an employee first", "error"); return; }
    if (!paidAmount || Number(paidAmount) <= 0) { showToast("Enter a valid salary amount", "error"); return; }
    if (!salaryMonth)   { showToast("Select salary month", "error"); return; }
    setProcessing(true);
    try {
      await processPayroll({
        employee_id:  employee.id,
        paid_amount:  parseFloat(paidAmount),
        salary_month: salaryMonth,
        salary_year:  Number(salaryYear),
      });
      showToast(`Payroll processed for ${employee.full_name}!`);
      setEmployee(null);
      setPaidAmount("");
      setCnic("");
      setSalaryMonth("");
    } catch { showToast("Processing failed. Try again.", "error"); }
    finally { setProcessing(false); }
  };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 animate-popIn flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.type === "error" ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>}
          {toast.msg}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <DollarSign size={22} className="text-rose-500" /> Process Payroll
          </h1>
          <p className="page-sub">Search employee by CNIC and process monthly salary</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Search Panel */}
        <div className="erp-card p-6 animate-slideInLeft space-y-5">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Search size={16} className="text-indigo-500" /> Find Employee
          </h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Employee CNIC</label>
            <div className="flex gap-2">
              <input
                value={cnic}
                onChange={e => setCnic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="e.g. 35202-1234567-9"
                className="erp-input flex-1"
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="btn-primary flex items-center gap-1 whitespace-nowrap"
              >
                <Search size={15} />
                {searching ? "…" : "Search"}
              </button>
            </div>
          </div>

          {/* Employee card */}
          {employee && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 animate-fadeIn space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow">
                  <User size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{employee.full_name}</p>
                  <p className="text-xs text-slate-500">{employee.designation || "—"} · {employee.branch_title || "—"}</p>
                </div>
              </div>
              {employee.salary && (
                <p className="text-sm text-indigo-700 font-medium">
                  Base Salary: PKR {Number(employee.salary).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Payroll Form */}
        <div className="erp-card p-6 animate-slideInRight space-y-5">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Calendar size={16} className="text-rose-500" /> Salary Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Paid Amount (PKR)</label>
            <input
              type="number"
              value={paidAmount}
              onChange={e => setPaidAmount(e.target.value)}
              placeholder="Enter salary amount"
              className="erp-input"
              min={1}
              disabled={!employee}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Month</label>
              <select
                value={salaryMonth}
                onChange={e => setSalaryMonth(e.target.value)}
                className="erp-select"
                disabled={!employee}
              >
                <option value="">Select Month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Year</label>
              <input
                type="number"
                value={salaryYear}
                onChange={e => setSalaryYear(e.target.value)}
                className="erp-input"
                disabled={!employee}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleProcess}
              disabled={processing || !employee}
              className="btn-success flex-1 flex items-center justify-center gap-2"
            >
              <DollarSign size={16} />
              {processing ? "Processing…" : "Process Salary"}
            </button>
            {employee && (
              <button onClick={() => { setEmployee(null); setCnic(""); setPaidAmount(""); }} className="btn-outline">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="erp-card p-5 bg-slate-50 animate-fadeIn">
        <h3 className="font-semibold text-slate-700 mb-3">How to process payroll</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
          {[
            { step: "1", text: "Enter the employee's CNIC and click Search" },
            { step: "2", text: "Confirm the employee details and enter the salary amount" },
            { step: "3", text: "Select the month and year, then click Process Salary" },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 text-sm font-bold flex items-center justify-center shrink-0">{s.step}</span>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
