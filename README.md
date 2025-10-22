# MyShagun

This repository contains the source code for the MyShagun application, which includes a web frontend, a mobile frontend, and a backend server.

## Project Structure

*   `/web`: Contains the React-based web frontend.
*   `/mobile`: Contains the React Native-based mobile frontend (using Expo).
*   `/backend`: Contains the Node.js and Express-based backend server.

## Tech Stack

*   **Frontend (Web):** React (with Vite)
*   **Frontend (Mobile):** React Native (with Expo)
*   **Backend:** Node.js + Express
*   **Database:** MongoDB
*   **Authentication:** JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

*   Node.js and npm installed
*   Expo CLI installed (`npm install -g expo-cli`)
*   MongoDB installed and running (or a MongoDB Atlas account)

### Installation and Running

**1. Web Frontend**

```bash
cd web
npm install
npm run dev
```

**2. Mobile Frontend**

```bash
cd mobile
npm install
npm start
```

**3. Backend**

```bash
cd backend
npm install
npm start
```

### Database Setup

1.  Make sure your MongoDB server is running.
2.  In the `backend` directory, create a `config` directory.
3.  Inside the `config` directory, create a `db.js` file.
4.  Add the following code to `db.js` and replace `<your_mongodb_uri>` with your MongoDB connection string:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('<your_mongodb_uri>', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

5.  In `backend/index.js`, add the following lines to connect to the database:

```javascript
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();
```