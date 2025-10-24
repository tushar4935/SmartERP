// backend/controllers/inventoryController.js
import pool from "../config/db.js";

// @desc    List all inventory items
// @route   GET /api/inventory
export const listInventory = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("listInventory error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a new inventory item
// @route   POST /api/inventory
export const addItem = async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const result = await pool.query(
      "INSERT INTO inventory (name, quantity, price) VALUES ($1, $2, $3) RETURNING *",
      [name, quantity, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("addItem error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update an inventory item
// @route   PUT /api/inventory/:id
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, price } = req.body;
    const result = await pool.query(
      "UPDATE inventory SET name=$1, quantity=$2, price=$3 WHERE id=$4 RETURNING *",
      [name, quantity, price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateItem error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:id
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM inventory WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("deleteItem error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
