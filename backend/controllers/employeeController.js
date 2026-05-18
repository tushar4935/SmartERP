// backend/controllers/employeeController.js
import pool from "../config/db.js";

/**
 * Combined employee controller.
 * - preserves your existing listEmployees / addEmployee behavior
 * - adds get/update/delete
 * - adds payroll processing & history endpoints
 */

// @desc    Get all employees (optionally filter by dept_id)
// @route   GET /api/employees
export const listEmployees = async (req, res) => {
  const { dept_id } = req.query;
  try {
    let query = 'SELECT * FROM employees';
    const params = [];
    if (dept_id) {
      query += ' WHERE department_id = $1';
      params.push(dept_id);
    }
    query += ' ORDER BY id';
    const result = await pool.query(query, params);
    // return array for backward compatibility
    return res.json({ employees: result.rows });
  } catch (err) {
    console.error('listEmployees error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Add a new employee
// @route   POST /api/employees
export const addEmployee = async (req, res) => {
  const { name, email, department_id, role, salary, branch_id, full_name, cnic, contact, designation, photo } = req.body;

  // keep compatibility: allow either name (old) or full_name (new)
  const finalName = full_name || name;
  if (!finalName || !email) {
    return res.status(400).json({ error: 'name and email required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO employees
        (name, full_name, email, department_id, role, salary, branch_id, cnic, contact, designation, photo, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        name || null,
        finalName,
        email,
        department_id || null,
        role || 'employee',
        salary || null,
        branch_id || null,
        cnic || null,
        contact || null,
        designation || null,
        photo || null,
        req.user?.id || null
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addEmployee error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
export const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('getEmployee error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, department_id, role, salary, branch_id, full_name, cnic, contact, designation, photo } = req.body;
  const finalName = full_name || name;

  try {
    const q = `UPDATE employees SET
                 name = COALESCE($1, name),
                 full_name = COALESCE($2, full_name),
                 email = COALESCE($3, email),
                 department_id = COALESCE($4, department_id),
                 role = COALESCE($5, role),
                 salary = COALESCE($6, salary),
                 branch_id = COALESCE($7, branch_id),
                 cnic = COALESCE($8, cnic),
                 contact = COALESCE($9, contact),
                 designation = COALESCE($10, designation),
                 photo = COALESCE($11, photo),
                 updated_at = now()
               WHERE id = $12
               RETURNING *`;
    const params = [name || null, finalName || null, email || null, department_id || null, role || null, salary || null, branch_id || null, cnic || null, contact || null, designation || null, photo || null, id];
    const { rows } = await pool.query(q, params);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('updateEmployee error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteEmployee error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/* ---------------------------
   Payroll: process & history
   --------------------------- */

// @desc    Process payroll (create invoice record)
// @route   POST /api/employees/payrolls
export const processPayroll = async (req, res) => {
  const { employee_id, paid_amount, salary_month, salary_year, notes } = req.body;
  if (!employee_id) return res.status(400).json({ error: 'employee_id required' });

  try {
    const invoice_no = `ESA${Date.now()}`;
    const processed_by = req.user?.id || null;
    const q = `INSERT INTO payrolls (employee_id, invoice_no, paid_amount, salary_month, salary_year, processed_by, notes)
               VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const params = [employee_id, invoice_no, paid_amount || 0, salary_month || null, salary_year || null, processed_by, notes || null];
    const { rows } = await pool.query(q, params);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('processPayroll error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    List payrolls / salary history
// @route   GET /api/employees/payrolls
export const listPayrolls = async (req, res) => {
  try {
    const q = `SELECT p.*, e.full_name AS employee_name, u.email AS processed_by_email
               FROM payrolls p
               LEFT JOIN employees e ON p.employee_id = e.id
               LEFT JOIN users u ON p.processed_by = u.id
               ORDER BY p.processed_at DESC`;
    const { rows } = await pool.query(q);
    return res.json({ payrolls: rows });
  } catch (err) {
    console.error('listPayrolls error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Get payroll invoice details
// @route   GET /api/employees/payrolls/:id
export const getPayrollInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const q = `SELECT p.*, e.full_name AS employee_name, e.designation, e.cnic, b.title AS branch
               FROM payrolls p
               LEFT JOIN employees e ON p.employee_id = e.id
               LEFT JOIN branches b ON e.branch_id = b.id
               WHERE p.id = $1`;
    const { rows } = await pool.query(q, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('getPayrollInvoice error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
