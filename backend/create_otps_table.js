
require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const pool = require('./config/db');

const createTableQuery = `
  CREATE TABLE otps (
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    PRIMARY KEY (email)
  );
`;

(async () => {
  try {
    await pool.query(createTableQuery);
    console.log('Table "otps" created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    pool.end();
  }
})();
