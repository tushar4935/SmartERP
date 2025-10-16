// db.js - PostgreSQL connection
// db.js - PostgreSQL connection
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'erp_user',          // your DB username
  host: 'localhost',         // usually localhost
  database: 'smarterp',      // your DB name
  password: 'erp123',        // your DB password
  port: 5432,                // default PostgreSQL port
});

export default pool;
