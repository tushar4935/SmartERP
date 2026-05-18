import pool from "../config/db.js";

/* ================================
   STOCK CATEGORIES
================================ */

// List Categories
export const listCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sc.*, u.email as created_by_email
      FROM stock_categories sc
      LEFT JOIN users u ON sc.created_by = u.id
      ORDER BY sc.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add Category
export const addCategory = async (req, res) => {
  const { name } = req.body;
  const userId = req.user?.id;

  const result = await pool.query(
    `INSERT INTO stock_categories (name, created_by)
     VALUES ($1, $2) RETURNING *`,
    [name, userId]
  );

  res.status(201).json(result.rows[0]);
};

// Update Category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const result = await pool.query(
    `UPDATE stock_categories SET name=$1 WHERE id=$2 RETURNING *`,
    [name, id]
  );

  res.json(result.rows[0]);
};



/* ================================
   STOCK ITEMS
================================ */

// List Stock Items
export const listStock = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT si.*, sc.name AS category_name, u.email AS created_by_email
      FROM stock_items si
      LEFT JOIN stock_categories sc ON si.category_id = sc.id
      LEFT JOIN users u ON si.created_by = u.id
      ORDER BY si.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add New Stock Item
export const addStockItem = async (req, res) => {
  const {
    category_id,
    item_name,
    current_qty,
    expiry_date,
    manufacture_date,
    status
  } = req.body;

  const userId = req.user?.id;

  const result = await pool.query(
    `INSERT INTO stock_items
      (category_id, item_name, current_qty, expiry_date, manufacture_date, status, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [
      category_id,
      item_name,
      current_qty,
      expiry_date,
      manufacture_date,
      status,
      userId,
    ]
  );

  res.status(201).json(result.rows[0]);
};

// Update Stock Item
export const updateStockItem = async (req, res) => {
  const { id } = req.params;
  const {
    category_id,
    item_name,
    current_qty,
    expiry_date,
    manufacture_date,
    status
  } = req.body;

  const result = await pool.query(
    `UPDATE stock_items SET
        category_id=$1,
        item_name=$2,
        current_qty=$3,
        expiry_date=$4,
        manufacture_date=$5,
        status=$6
     WHERE id=$7 RETURNING *`,
    [
      category_id,
      item_name,
      current_qty,
      expiry_date,
      manufacture_date,
      status,
      id,
    ]
  );

  res.json(result.rows[0]);
};
