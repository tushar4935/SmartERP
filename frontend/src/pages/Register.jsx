import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password });
      if (res?.success && res?.user) navigate("/login", { replace: true });
      else setError(res?.message || "Registration failed.");
    } catch (err) { setError(err.message || "Registration error. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-100 opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-100 opacity-60" />
      </div>

      <div className="relative w-full max-w-md animate-scaleIn">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">SE</span>
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm mt-1">Join SmartERP today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {error && (
            <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm animate-fadeIn">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name" className="erp-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="erp-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 6 characters" className="erp-input pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition">
                  {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password" className="erp-input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : <UserPlus size={18} />}
              {loading ? "Creating…" : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
