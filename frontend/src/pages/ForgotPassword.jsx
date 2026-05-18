import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordReset } from "../api/api";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await sendPasswordReset(email);
      if (res?.success) {
        setMessage(res.message || "Password reset instructions sent. Check your inbox.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(res?.message || "Unable to send reset email.");
      }
    } catch (err) { setError(err.message || "Network error. Try again later."); }
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
            <Mail size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-slate-500 text-sm mt-1">Enter your email to receive reset instructions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {message && (
            <div className="mb-4 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm animate-fadeIn">
              <CheckCircle2 size={16} className="shrink-0" /> {message}
            </div>
          )}
          {error && (
            <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm animate-fadeIn">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
                className="erp-input"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : <Mail size={18} />}
                {loading ? "Sending…" : "Send Reset Email"}
              </button>
              <button type="button" onClick={() => navigate("/login")} className="btn-outline flex items-center gap-1">
                <ArrowLeft size={15} /> Back
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Remembered your password?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
