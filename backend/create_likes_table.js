require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const pool = require('./config/db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS profile_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_profile_id VARCHAR(36) NOT NULL,
    to_profile_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (to_profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (from_profile_id, to_profile_id)
);
`;

(async () => {
  try {
    await pool.query(createTableQuery);
    console.log('Table "profile_likes" created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating table:', err);
    process.exit(1);
  }
})();
