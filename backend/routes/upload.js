// backend/routes/upload.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Ensure upload directory exists
const UPLOAD_DIR = path.resolve("backend/uploads/companies");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    const unique = `${base}-${Date.now()}${ext}`;
    cb(null, unique);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images are allowed"));
  }
});

// POST /api/companies/upload-logo
router.post("/companies/upload-logo", upload.single("logo"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Construct URL accessible by frontend. If using reverse proxy, adjust
    const host = process.env.SERVER_HOST || `http://localhost:${process.env.PORT || 5000}`;
    // Serve static from /uploads path in index.js (see below)
    const url = `${host}/uploads/companies/${req.file.filename}`;
    return res.json({ url });
  } catch (err) {
    console.error("upload error", err);
    return res.status(500).json({ error: "Upload error" });
  }
});

export default router;
