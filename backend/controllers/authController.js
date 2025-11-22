// // backend/controllers/authController.js
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import pool from "../config/db.js";

// dotenv.config();

// // -------------------------------
// // ✅ Register User
// // -------------------------------
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (existing.rows.length > 0) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await pool.query(
//       "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
//       [name, email, hashedPassword, role || "employee"]
//     );

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Register Error:", error.message);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// };

// // -------------------------------
// // ✅ Login User
// // -------------------------------
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const normalizedEmail = email.toLowerCase();

//     const userResult = await pool.query(
//       "SELECT * FROM users WHERE LOWER(email) = $1",
//       [normalizedEmail]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const user = userResult.rows[0];

//     if (user.password !== password) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET || "your-secret-key",
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("🔥 Login Error:", error.message);
//     res.status(500).json({ message: "Server error during login" });
//   }
// };






// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

// -------------------------------
// ✅ Register User
// -------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [
      normalizedEmail,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password securely before storing
    const hashedPassword = await bcrypt.hash(String(password), 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, normalizedEmail, hashedPassword, role || "employee"]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// -------------------------------
// ✅ Login User (fixed)
// -------------------------------
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Normalize email and ensure password is a string
    const normalizedEmail = String(email).trim().toLowerCase();
    password = String(password);

    // Fetch user by email (case-insensitive)
    const userResult = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [
      normalizedEmail,
    ]);

    if (userResult.rows.length === 0) {
      // Avoid leaking which side failed — generic message
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    // === FIX: use bcrypt.compare to verify the plain password against the stored hash ===
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token (keep your existing secret from .env)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("🔥 Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};
