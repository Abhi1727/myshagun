require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const pool = require('./config/db');

const addColumnQuery = `
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS interested_in VARCHAR(255);
`;

(async () => {
  try {
    await pool.query(addColumnQuery);
    console.log('Column "interested_in" added successfully to profiles table.');
    process.exit(0);
  } catch (err) {
    console.error('Error adding column:', err);
    process.exit(1);
  }
})();
