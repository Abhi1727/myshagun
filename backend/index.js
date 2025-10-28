require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const cors = require('cors');


const app = express();

app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('Hello from the MyShagun backend!');
});

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/events', require('./routes/api/events'));
app.use('/api/gifts', require('./routes/api/gifts'));
app.use('/api/kiosks', require('./routes/api/kiosks'));
app.use('/api/profiles', require('./routes/api/profiles'));
app.use('/api/chat', require('./routes/api/chat'));

app.listen(port, async () => {
  console.log(`Server is running on port: ${port}`);
  try {
    const [rows] = await db.query('SELECT NOW() as currentTime');
    console.log('MySQL connected:', rows[0].currentTime);
  } catch (err) {
    console.error('Database connection error', err.stack);
  }
});
