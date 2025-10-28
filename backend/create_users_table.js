
require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const pool = require('./config/db');

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

(async () => {
  try {
    await pool.query(createTableQuery);
    console.log('Table "users" created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    pool.end();
  }
})();
