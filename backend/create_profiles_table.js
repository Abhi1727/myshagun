require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const pool = require('./config/db');

const createTableQuery = `
CREATE TABLE profiles (
    id VARCHAR(36) PRIMARY KEY,
    profile_for VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth DATE,
    religion VARCHAR(255),
    community VARCHAR(255),
    sub_community VARCHAR(255),
    living_in VARCHAR(255),
    email VARCHAR(255),
    mobile_number VARCHAR(255),
    city VARCHAR(255),
    lives_with_family BOOLEAN,
    marital_status VARCHAR(255),
    height VARCHAR(255),
    diet VARCHAR(255),
    highest_qualification VARCHAR(255),
    college_name VARCHAR(255),
    profession VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    profile_photo_url TEXT,
    profile_photo_url_2 TEXT,
    profile_photo_url_3 TEXT,
    smoking VARCHAR(255),
    drinking VARCHAR(255),
    state VARCHAR(255),
    interested_for VARCHAR(255),
    interested_in VARCHAR(255)
);
`;

(async () => {
  try {
    await pool.query(createTableQuery);
    console.log('Table "profiles" created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  }
})();