require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const pool = require('./config/db');
const { v4: uuidv4 } = require('uuid');

const profiles = [
  {
    profile_for: 'myself',
    first_name: 'Rahul',
    last_name: 'Sharma',
    date_of_birth: '1990-05-15',
    religion: 'Hindu',
    community: 'Brahmin',
    living_in: 'New York, USA',
    email: 'rahul.sharma@example.com',
    mobile_number: '1234567890',
    city: 'New York',
    lives_with_family: true,
    marital_status: 'single',
    height: "5'10\"",
    diet: 'vegetarian',
    highest_qualification: 'masters-degree',
    college_name: 'Columbia University',
    profession: 'Software Engineer',
    profile_photo_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&h=500&fit=crop',
    smoking: 'no',
    drinking: 'no',
    state: 'New York',
    interested_for: 'marriage'
  },
  {
    profile_for: 'daughter',
    first_name: 'Priya',
    last_name: 'Patel',
    date_of_birth: '1992-11-20',
    religion: 'Hindu',
    community: 'Patel',
    living_in: 'London, UK',
    email: 'priya.patel@example.com',
    mobile_number: '0987654321',
    city: 'London',
    lives_with_family: false,
    marital_status: 'single',
    height: "5'5\"",
    diet: 'non-vegetarian',
    highest_qualification: 'bachelors-degree',
    college_name: 'University of London',
    profession: 'Doctor',
    profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop',
    smoking: 'no',
    drinking: 'socially',
    state: 'London',
    interested_for: 'marriage'
  },
  {
    profile_for: 'son',
    first_name: 'James',
    last_name: 'Smith',
    date_of_birth: '1988-08-10',
    religion: 'Christian',
    community: 'Catholic',
    living_in: 'Sydney, Australia',
    email: 'james.smith@example.com',
    mobile_number: '1122334455',
    city: 'Sydney',
    lives_with_family: true,
    marital_status: 'divorced',
    height: "6'0\"",
    diet: 'non-vegetarian',
    highest_qualification: 'phd',
    college_name: 'University of Sydney',
    profession: 'Professor',
    profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    smoking: 'yes',
    drinking: 'yes',
    state: 'New South Wales',
    interested_for: 'remarriage'
  },
  {
    profile_for: 'friend',
    first_name: 'Sarah',
    last_name: 'Jones',
    date_of_birth: '1995-02-25',
    religion: 'Agnostic',
    community: 'N/A',
    living_in: 'Toronto, Canada',
    email: 'sarah.jones@example.com',
    mobile_number: '5544332211',
    city: 'Toronto',
    lives_with_family: false,
    marital_status: 'single',
    height: "5'7\"",
    diet: 'vegan',
    highest_qualification: 'bachelors-degree',
    college_name: 'University of Toronto',
    profession: 'Graphic Designer',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    smoking: 'no',
    drinking: 'no',
    state: 'Ontario',
    interested_for: 'dating'
  }
];

const seedDatabase = async () => {
  try {
    for (const profile of profiles) {
      const insertQuery = `
        INSERT INTO profiles (
          id, profile_for, first_name, last_name, date_of_birth, religion, community,
          living_in, email, mobile_number, city, lives_with_family, marital_status,
          height, diet, highest_qualification, college_name, profession, profile_photo_url,
          smoking, drinking, state, interested_for
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      const values = [
        uuidv4(),
        profile.profile_for,
        profile.first_name,
        profile.last_name,
        profile.date_of_birth,
        profile.religion,
        profile.community,
        profile.living_in,
        profile.email,
        profile.mobile_number,
        profile.city,
        profile.lives_with_family,
        profile.marital_status,
        profile.height,
        profile.diet,
        profile.highest_qualification,
        profile.college_name,
        profile.profession,
        profile.profile_photo_url,
        profile.smoking,
        profile.drinking,
        profile.state,
        profile.interested_for
      ];
      await pool.query(insertQuery, values);
    }
    console.log('Dummy data inserted successfully.');
  } catch (err) {
    console.error('Error inserting dummy data:', err);
  } finally {
    pool.end();
  }
};

seedDatabase();
