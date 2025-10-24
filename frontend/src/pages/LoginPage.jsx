// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

/**
 * ✅ Fixed LoginPage
 * - Correctly calls loginUser(email, password)
 * - Handles errors gracefully
 * - Styled with Tailwind
 * - Redirects to dashboard on success
 *
 * Complexity:
 *   - Time: O(1)
 *   - Space: O(1)
 */

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ FIXED: Pass as (email, password) instead of { email, password }
      const res = await loginUser(email, password);

      if (res?.token) {
        // Save token and user info
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        // Redirect to dashboard (or home)
        navigate("/dashboard");
      } else {
        setError(res?.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to access your SmartERP dashboard
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // ✅ value only
              required
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // ✅ value only
              required
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Your password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
              loading
                ? "bg-indigo-300 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          Forgot password?{" "}
          <button
            className="text-indigo-600 hover:underline"
            onClick={() => alert("Password reset not implemented yet")}
          >
            Reset
          </button>
        </p>
      </div>
    </div>
  );
}
