# MyShagun Mobile App - Setup Guide

This guide will help you set up and run the MyShagun mobile application built with React Native and Expo.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** app on your mobile device (available on iOS App Store and Google Play Store)
- For iOS development: **Xcode** (macOS only)
- For Android development: **Android Studio** with Android SDK

## Features Implemented

### Authentication
- ✅ Email/Password Login
- ✅ OTP-based Login
- ✅ Comprehensive 4-step Registration Form

### Registration Form Fields
The registration process has been updated to match the web version with 4 steps:

**Step 1: Personal Information**
- Interested In (Male/Female)
- Interested For (Self/Son/Daughter/Brother/Sister/Friend/Relative)
- First Name & Last Name
- Date of Birth (with date picker)
- Religion
- Email & Password
- Mobile Number

**Step 2: Location & Family**
- City & State
- Lives With Family
- Marital Status

**Step 3: Physical & Lifestyle**
- Height
- Diet Preference
- Smoking Habits
- Drinking Habits

**Step 4: Professional Information**
- Highest Qualification
- Profession

### Home Features
- Browse/Swipe Profiles
- Messaging System
- User Profile Management

## Setup Instructions

### 1. Navigate to Mobile Directory
```bash
cd /home/pariharabhishek34/myshagun/mobile
```

### 2. Install Dependencies
Dependencies are already installed, but if you need to reinstall:
```bash
npm install
```

### 3. Configure API Endpoint

The API endpoint is configured in `config/api.js`:
- **Development (Android Emulator)**: `http://10.0.2.2:5001/api`
- **Production**: `https://api.myshagun.us/api`

To test with your local backend:
- If using Android Emulator: No changes needed (uses `10.0.2.2`)
- If using physical device: Update the API URL to your computer's IP address

**To find your local IP address:**
```bash
# On Linux/Mac
ip addr show | grep inet

# On Windows
ipconfig
```

Then update `config/api.js`:
```javascript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_COMPUTER_IP:5001/api' // Replace with your IP
  : 'https://api.myshagun.us/api';
```

### 4. Start the Backend Server

Make sure your backend server is running:
```bash
cd ../backend
npm start
```

The backend should be running on port 5001.

### 5. Start the Mobile App

```bash
cd ../mobile
npm start
```

This will start the Expo development server and show a QR code.

### 6. Run on Device/Emulator

**Option A: Physical Device (Recommended for Testing)**
1. Install **Expo Go** from App Store (iOS) or Google Play (Android)
2. Open Expo Go app
3. Scan the QR code from the terminal
4. The app will load on your device

**Option B: Android Emulator**
```bash
npm run android
```
Make sure Android Studio is installed and an emulator is running.

**Option C: iOS Simulator (macOS only)**
```bash
npm run ios
```
Requires Xcode to be installed.

## Testing the App

### 1. Test Registration Flow
1. Open the app
2. Tap "Don't have an account? Create One"
3. Complete all 4 steps of registration:
   - Step 1: Fill in personal information
   - Step 2: Location and family details
   - Step 3: Physical and lifestyle preferences
   - Step 4: Professional information
4. Submit and verify you're logged in

### 2. Test Login
**Email/Password Login:**
- Enter registered email and password
- Tap "Sign In"

**OTP Login:**
- Tap "Login with OTP instead"
- Enter your email
- Tap "Send OTP"
- Check your email for 6-digit code
- Enter OTP and tap "Verify & Login"

### 3. Test Main Features
- Browse profiles in the Swipe tab
- Check messages in Messages tab
- View your profile in Profile tab

## Troubleshooting

### Issue: Cannot connect to backend
**Solution:**
- Ensure backend is running on port 5001
- Check that your firewall isn't blocking connections
- If using physical device, make sure you're on the same network as your computer
- Update API_BASE_URL with correct IP address

### Issue: Date picker not showing
**Solution:**
- For Android: Works out of the box
- For iOS: Requires additional setup in Xcode

### Issue: App crashes on startup
**Solution:**
```bash
# Clear Metro bundler cache
npm start -- --reset-cache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: Picker not displaying correctly
**Solution:**
- This is a known issue on Android. The picker is functional but styling may vary.
- On iOS, the picker appears as a modal wheel selector.

## API Endpoints Used

The mobile app uses the following backend endpoints:

### Authentication
- `POST /api/auth` - Email/Password login
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth` - Get current user profile

### Users
- `POST /api/users` - Register new user with profile

### Profiles
- `GET /api/profiles/featured` - Get featured profiles
- `GET /api/profiles` - Get all profiles

### Chat
- `POST /api/chat/like` - Like a profile
- `GET /api/chat/matches` - Get matched users
- `GET /api/chat/messages/:userId` - Get messages with a user
- `POST /api/chat/messages` - Send a message

## Project Structure

```
mobile/
├── components/
│   ├── Login.js           # Login screen with OTP support
│   ├── Register.js        # 4-step registration form
│   ├── Home.js           # Main home screen with tabs
│   ├── SwipeProfiles.js  # Profile browsing/swiping
│   ├── Messages.js       # Messages list
│   └── Chat.js           # Chat conversation
├── config/
│   └── api.js            # API configuration
├── App.js                # Main app component
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── MOBILE_SETUP.md       # This file
```

## Recent Updates

### ✅ November 2024 Updates
1. **Updated Registration Form**: Now matches web version with all 17 profile fields
2. **Added OTP Login**: Users can now login using OTP sent to email
3. **Updated Dependencies**: Added date picker and picker components
4. **API Integration**: Fixed all API endpoints to use proper configuration
5. **Improved UI**: Better styling and user experience across all screens

## Building for Production

### Android APK
```bash
# Build APK using EAS
eas build --platform android --profile preview
```

### iOS IPA
```bash
# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

## Next Steps

1. **Test all features thoroughly** on both iOS and Android
2. **Update production API URL** in `config/api.js` before deploying
3. **Configure app icons and splash screen** in `app.json`
4. **Set up push notifications** for new messages (future enhancement)
5. **Add photo upload functionality** for profile pictures (future enhancement)

## Support

For issues or questions:
- Check the main project README.md
- Review backend API documentation
- Test backend endpoints independently before testing mobile app

## Environment Configuration

**Development:**
- Backend: `http://10.0.2.2:5001` (Android) or `http://localhost:5001` (iOS)
- Auto-reload enabled

**Production:**
- Backend: `https://api.myshagun.us`
- Optimized builds

---

**Happy Coding!** 🎉
