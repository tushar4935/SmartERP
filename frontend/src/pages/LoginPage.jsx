// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../api/api";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const data = await loginUser(email.trim(), password.trim());

//       // ✅ Save token and user info locally
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // ✅ Redirect based on role
//       if (data.user?.role === "admin") {
//         navigate("/admin-dashboard");
//       } else {
//         navigate("/employee-dashboard");
//       }
//     } catch (err) {
//       // ✅ Display accurate backend message if available
//       console.error("Login error:", err.message);
//       setError(err.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 style={{ color: "#007bff", marginBottom: "15px" }}>SmartERP Login</h2>

//         <form onSubmit={handleSubmit}>
//           <label>Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             autoComplete="username"
//           />

//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             autoComplete="current-password"
//           />

//           {error && (
//             <p style={{ color: "red", marginTop: "10px", fontSize: "0.9rem" }}>
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               marginTop: "15px",
//               backgroundColor: "#007bff",
//               color: "white",
//               border: "none",
//               padding: "10px 0",
//               borderRadius: "5px",
//               cursor: loading ? "not-allowed" : "pointer",
//               width: "100%",
//             }}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }





















import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

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

    console.clear();
    console.log("🟡 Submitting login:", { email, password });

    try {
      const data = await loginUser(email.trim(), password.trim());
      console.log("🟢 Backend response:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "admin") {
        console.log("✅ Redirecting to Admin Dashboard");
        navigate("/admin-dashboard");
      } else {
        console.log("✅ Redirecting to Employee Dashboard");
        navigate("/employee-dashboard");
      }
    } catch (err) {
      console.error("❌ Login error (caught):", err);
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{ color: "#007bff", marginBottom: "15px" }}>SmartERP Login</h2>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p style={{ color: "red", marginTop: "10px", fontSize: "0.9rem" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 0",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
