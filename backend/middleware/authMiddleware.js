import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    if (!decoded?.id) {
      return res.status(401).json({ message: "Malformed token payload" });
    }

    // FIX: added client_id to the SELECT so req.user.client_id is always populated.
    // Without this, every controller that filters by client_id (sales, purchases,
    // customers, suppliers, accounting) would filter by undefined — returning nothing
    // or inserting NULL into NOT NULL columns.
    const userRes = await pool.query(
      `SELECT u.id, u.name, u.email, u.contact_no, u.is_active,
              u.user_type_id, u.client_id,
              t.name AS user_type_name
       FROM users u
       LEFT JOIN user_types t ON u.user_type_id = t.id
       WHERE u.id = $1`,
      [decoded.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    const dbUser = userRes.rows[0];

    if (!dbUser.is_active) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    req.user = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      user_type_id: dbUser.user_type_id,
      client_id: dbUser.client_id,   // FIX: was missing — caused undefined in all data queries
      role: dbUser.user_type_name?.toLowerCase() || "user",
    };

    return next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(500).json({ message: "Server side token verification failed" });
  }
};

export const adminOnly = (req, res, next) => {
  const role = req.user?.role || "";
  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

export default authMiddleware;
