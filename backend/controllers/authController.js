import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

/**
 * REGISTER USER
 * POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, user_type_id } = req.body;

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // FIX: column is password_hash, not password
    const hashedPassword = await bcrypt.hash(String(password), 10);

    // FIX: schema has (name, email, password_hash, user_type_id) — no 'role' column
    await pool.query(
      "INSERT INTO users (name, email, password_hash, user_type_id) VALUES ($1, $2, $3, $4)",
      [name, normalizedEmail, hashedPassword, user_type_id || null]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * LOGIN USER
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    password = String(password);

    // FIX: select password_hash (not password), and join user_types for role name
    const userResult = await pool.query(
      `SELECT u.*, t.name AS user_type_name
       FROM users u
       LEFT JOIN user_types t ON u.user_type_id = t.id
       WHERE LOWER(u.email) = $1`,
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    // FIX: compare against password_hash column
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const role = user.user_type_name?.toLowerCase() || "employee";

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        user_type_id: user.user_type_id,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};
