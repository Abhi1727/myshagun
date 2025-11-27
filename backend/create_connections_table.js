require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const pool = require('./config/db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS profile_connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id_1 VARCHAR(36) NOT NULL,
    profile_id_2 VARCHAR(36) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id_1) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id_2) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_connection (profile_id_1, profile_id_2)
);
`;

(async () => {
  try {
    await pool.query(createTableQuery);
    console.log('Table "profile_connections" created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating table:', err);
    process.exit(1);
  }
})();
