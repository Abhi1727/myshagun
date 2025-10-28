# MyShagun - Deployment Guide

## ✅ COMPLETED FEATURES

### Backend (Port 5001)
- ✅ User authentication (Email/Password + OTP)
- ✅ Profile management
- ✅ Chat system (conversations + messages)
- ✅ Like/Match system (Tinder-style)
- ✅ Database: MySQL with all tables created

### Website (Port 8080)
- ✅ Login/Register
- ✅ Dashboard with user profile
- ✅ Tinder-style swipe cards (`/browse`)
- ✅ Chat list (`/messages`)
- ✅ Real-time messaging (`/chat/:id`)
- ✅ Like & Match notifications

### Mobile App (React Native + Expo)
- ✅ Login with AsyncStorage
- ✅ Bottom tab navigation (Browse/Messages/Profile)
- ✅ Tinder swipe profiles
- ✅ Chat functionality
- ✅ Like & Match system

---

## 🚀 HOW TO RUN

### Backend
```bash
cd backend
node index.js
# Runs on http://localhost:5001
```

### Website
```bash
cd web
npm run dev
# Runs on http://localhost:8080
```

### Mobile App
```bash
cd mobile
npm start
# Opens Expo dev tools
# Press 'a' for Android or 'i' for iOS
```

---

## 🌐 PRODUCTION DEPLOYMENT

### 1. Backend (API)
**Domain:** `https://api.myshagun.us`

**Steps:**
1. Deploy to VPS/Cloud (AWS, DigitalOcean, etc.)
2. Install Node.js + MySQL
3. Update `.env`:
   ```
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_secure_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=5001
   ```
4. Setup Nginx reverse proxy
5. Use PM2 to keep running:
   ```bash
   npm install -g pm2
   pm2 start index.js --name myshagun-api
   pm2 startup
   pm2 save
   ```

### 2. Website
**Domain:** `https://myshagun.us`

**Steps:**
1. Update `web/.env` (if exists):
   ```
   VITE_API_BASE_URL=https://api.myshagun.us/api
   ```
2. Build:
   ```bash
   npm run build
   ```
3. Deploy `dist/` folder to:
   - Vercel (easiest)
   - Netlify
   - Your VPS with Nginx

### 3. Mobile App (Play Store)

#### Update API URL:
Edit `mobile/config/api.js`:
```javascript
const API_BASE_URL = 'https://api.myshagun.us/api';
```

#### Build APK:
```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android
```

#### Publish to Play Store:
1. Create Google Play Console account ($25 one-time)
2. Download APK from EAS build
3. Create app listing
4. Upload APK
5. Submit for review

---

## 📱 TESTING MOBILE APP LOCALLY

### Option 1: Use ngrok (Quick Test)
```bash
# In backend directory
ngrok http 5001
# Copy the https URL (e.g., https://abc123.ngrok.io)
```

Update `mobile/config/api.js`:
```javascript
const API_BASE_URL = 'https://abc123.ngrok.io/api';
```

### Option 2: Use Local IP (Same WiFi)
```bash
# Find your IP
# Mac/Linux: ifconfig | grep "inet "
# Windows: ipconfig

# Update mobile/config/api.js:
const API_BASE_URL = 'http://YOUR_IP:5001/api';
```

---

## 🔧 IMPORTANT CONFIGURATIONS

### Email Setup (For OTP)
1. Go to https://myaccount.google.com/apppasswords
2. Generate App Password for "Mail"
3. Update `backend/.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

### Database Tables
Already created:
- ✅ users
- ✅ profiles
- ✅ otps
- ✅ conversations
- ✅ messages
- ✅ likes

---

## 📊 API ENDPOINTS

### Auth
- POST `/api/auth` - Login
- POST `/api/auth/send-otp` - Send OTP
- POST `/api/auth/verify-otp` - Verify OTP
- GET `/api/auth` - Get user profile (Protected)

### Users
- POST `/api/users` - Register

### Profiles
- GET `/api/profiles/featured` - Get profiles

### Chat
- GET `/api/chat/conversations` - Get chats (Protected)
- GET `/api/chat/messages/:id` - Get messages (Protected)
- POST `/api/chat/send` - Send message (Protected)
- POST `/api/chat/like` - Like profile (Protected)

---

## 🎨 BRANDING

- Primary Color: `#ec4899` (Pink)
- Theme: Romantic/Warm
- Logo: Located in `assets/` folders

---

## 📞 SUPPORT

Test Accounts:
- Email: pariharabhishek34@gmail.com
- Password: myshagun123

Backend URL (Development): http://localhost:5001
Website URL (Development): http://localhost:8080
Production API: https://api.myshagun.us
Production Web: https://myshagun.us

---

## ✅ CHECKLIST BEFORE DEPLOYMENT

Backend:
- [ ] Update .env with production values
- [ ] Configure email for OTP
- [ ] Setup SSL certificate
- [ ] Configure CORS for production domain

Website:
- [ ] Update API URL to production
- [ ] Test all pages
- [ ] Build production version

Mobile:
- [ ] Update API URL to production
- [ ] Test login flow
- [ ] Test swipe/like
- [ ] Test chat
- [ ] Build APK/AAB for Play Store

---

**Everything is ready! Both website and mobile app are fully functional!** 🎉
