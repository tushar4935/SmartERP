-- backend/db/schema.sql

-- user_types table
CREATE TABLE IF NOT EXISTS user_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  contact_no VARCHAR(50),
  user_type_id INTEGER REFERENCES user_types(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
-- companies table
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  address TEXT,
  contact_no VARCHAR(50),
  email VARCHAR(255),
  created_by INTEGER, -- user id who created (nullable)
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);






-- account_heads table
CREATE TABLE IF NOT EXISTS account_heads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(64) DEFAULT '0',
  description TEXT,
  created_by INTEGER,    -- user id who created
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Seed default heads (run once)
INSERT INTO account_heads (name, code, description)
VALUES
('Assets', '0', 'Main asset head'),
('Liabilities', '0', 'Main liabilities head'),
('Expenses', '0', 'Expense head'),
('Capital', '0', 'Capital head'),
('Revenue', '0', 'Revenue head')
ON CONFLICT DO NOTHING;



-- financial_years table
CREATE TABLE IF NOT EXISTS financial_years (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,    -- e.g. "2020-2021"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_by INTEGER,       -- user id who created
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Optional: set one year active by default (uncomment & adapt if needed)
-- UPDATE financial_years SET is_active = (id = <desired_id>);
-- customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255),
  branch VARCHAR(255),
  customer_name VARCHAR(255) NOT NULL,
  contact_no VARCHAR(64),
  area VARCHAR(255),
  address TEXT,
  assigned_user_id INTEGER, -- reference to users.id (optional)
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
-- suppliers table (simple)
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255),           -- company name (free text or company id later)
  branch VARCHAR(255),            -- branch name (free text or branch id later)
  supplier_name VARCHAR(255) NOT NULL,
  contact_no VARCHAR(64),
  email VARCHAR(255),
  address TEXT,
  description TEXT,
  assigned_user_id INTEGER,       -- optional reference to users.id
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
-- Branches & Branch Users
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  client_id INTEGER,           -- optional: tie branches to a client
  level VARCHAR(50),
  title TEXT NOT NULL,
  contact TEXT,
  address TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS branch_users (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
  user_id INTEGER,             -- optional: map to users table
  name TEXT NOT NULL,
  email TEXT,
  contact TEXT,
  user_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- Employees & Payroll (salary history)
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  cnic VARCHAR(30),
  contact VARCHAR(50),
  designation TEXT,
  photo TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payrolls (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  invoice_no TEXT,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  salary_month VARCHAR(20),
  salary_year INTEGER,
  processed_by INTEGER,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);
-- ===============================
-- STOCK CATEGORIES TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS stock_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- ===============================
-- STOCK ITEMS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS stock_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES stock_categories(id),
  item_name VARCHAR(200) NOT NULL,
  current_qty INTEGER DEFAULT 0,
  expiry_date DATE,
  manufacture_date DATE,
  status BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);
-- =========================
-- ACCOUNT CONTROLS
-- =========================
CREATE TABLE IF NOT EXISTS account_controls (
  id SERIAL PRIMARY KEY,
  head_account VARCHAR(100) NOT NULL,
  control_account VARCHAR(100) NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- =========================
-- ACCOUNT SUB CONTROLS
-- =========================
CREATE TABLE IF NOT EXISTS account_sub_controls (
  id SERIAL PRIMARY KEY,
  account_control_id INTEGER REFERENCES account_controls(id) ON DELETE CASCADE,
  sub_control_account VARCHAR(100) NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- =========================
-- ACCOUNT FLOW
-- =========================
CREATE TABLE IF NOT EXISTS account_flows (
  id SERIAL PRIMARY KEY,
  activity VARCHAR(100) NOT NULL,
  head_account VARCHAR(100) NOT NULL,
  control_account VARCHAR(100) NOT NULL,
  sub_control_account VARCHAR(100),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);


ALTER TABLE customers
ADD COLUMN IF NOT EXISTS client_id INTEGER;



CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  invoice_no VARCHAR(50) UNIQUE NOT NULL,
  client_id INTEGER NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  financial_year_id INTEGER REFERENCES financial_years(id),
  total_amount NUMERIC(12,2) NOT NULL,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  remaining_amount NUMERIC(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  status VARCHAR(20) DEFAULT 'PENDING', -- PAID | PENDING
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE IF NOT EXISTS sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
  stock_item_id INTEGER REFERENCES stock_items(id),
  qty INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(12,2) GENERATED ALWAYS AS (qty * unit_price) STORED
);

CREATE TABLE IF NOT EXISTS sale_payments (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  received_by INTEGER REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS sale_returns (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sales(id),
  return_total NUMERIC(12,2) NOT NULL,
  paid_return NUMERIC(12,2) DEFAULT 0,
  remaining_return NUMERIC(12,2) GENERATED ALWAYS AS (return_total - paid_return) STORED,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE suppliers
ADD COLUMN IF NOT EXISTS client_id INTEGER;


CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  client_id INT,
  name TEXT,
  type TEXT, -- ASSET, LIABILITY, EXPENSE, INCOME, EQUITY
  created_at TIMESTAMP DEFAULT now()
);
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  client_id INT,
  account_id INT,
  debit NUMERIC DEFAULT 0,
  credit NUMERIC DEFAULT 0,
  reference_type TEXT, -- SALE, PURCHASE, PAYMENT, MANUAL
  reference_id INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ===============================
-- PURCHASES (missing from original schema)
-- ===============================
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  invoice_no VARCHAR(50) UNIQUE NOT NULL,
  client_id INTEGER NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id),
  financial_year_id INTEGER REFERENCES financial_years(id),
  total_amount NUMERIC(12,2) NOT NULL,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  remaining_amount NUMERIC(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchase_items (
  id SERIAL PRIMARY KEY,
  purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
  stock_item_id INTEGER REFERENCES stock_items(id),
  qty INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(12,2) GENERATED ALWAYS AS (qty * unit_price) STORED
);

CREATE TABLE IF NOT EXISTS purchase_payments (
  id SERIAL PRIMARY KEY,
  purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  paid_by INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS purchase_returns (
  id SERIAL PRIMARY KEY,
  purchase_id INTEGER REFERENCES purchases(id),
  return_total NUMERIC(12,2) NOT NULL,
  paid_return NUMERIC(12,2) DEFAULT 0,
  remaining_return NUMERIC(12,2) GENERATED ALWAYS AS (return_total - paid_return) STORED,
  created_at TIMESTAMP DEFAULT now()
);

-- Add client_id to users so each user belongs to a company (client).
-- This is required because all core tables (sales, purchases, customers, etc.)
-- filter data by client_id from req.user.client_id.
ALTER TABLE users
ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES companies(id) ON DELETE SET NULL;
