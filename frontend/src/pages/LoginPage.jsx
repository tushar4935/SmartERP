import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const navigate  = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const role = data.user?.role || "employee";
      navigate(role === "admin" ? "/admin-dashboard" : "/employee-dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-100 opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-100 opacity-60" />
      </div>

      <div className="relative w-full max-w-md animate-scaleIn">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">SE</span>
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            SmartERP
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your control panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@smarterp.com"
                className="erp-input"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="erp-input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm animate-fadeIn">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-4 text-sm text-slate-500">
            <Link to="/forgot-password" className="hover:text-indigo-600 transition font-medium">
              Forgot password?
            </Link>
            <span className="text-slate-300">·</span>
            <Link to="/register" className="hover:text-indigo-600 transition font-medium">
              Register
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          SmartERP © {new Date().getFullYear()} · All rights reserved
        </p>
      </div>
    </div>
  );
}
