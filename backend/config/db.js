const { Pool } = require('pg');

// The Pool constructor will automatically use the PG* environment variables.
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};