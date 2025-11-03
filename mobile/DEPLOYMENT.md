# MyShagun Mobile App - Deployment Guide

This guide will walk you through deploying the MyShagun mobile app to Expo and building APK/IPA files.

## Prerequisites
- Expo account (you have: abhishek1727)
- Expo CLI installed: `npm install -g expo-cli eas-cli`
- Your app is already configured with project ID: `b458620b-e88f-4f8f-837f-75b4fcee8a04`

## Version Information
- **App Version**: 1.1.0 (updated with new registration form and OTP login)
- **Android Version Code**: 2
- **Package**: com.myshagun.app

## Deployment Steps

### Step 1: Login to Expo

Open a **new terminal** (not in Claude Code) and run:

```bash
cd /home/pariharabhishek34/myshagun/mobile

# Login to Expo
npx expo login
# Enter your username: abhishek1727
# Enter your password: [your password]
```

Verify you're logged in:
```bash
npx expo whoami
# Should show: abhishek1727
```

### Step 2: Update Production API URL (Important!)

Before deploying, make sure the API points to your production server:

Edit `config/api.js` and set your production API URL:
```javascript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:5001/api' // Development
  : 'https://YOUR_PRODUCTION_DOMAIN/api'; // Update this!
```

For example:
```javascript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:5001/api'
  : 'https://api.myshagun.us/api'; // Your production URL
```

### Step 3: Build the App

#### Option A: Build for Expo Go (Quick Testing)
This publishes your app to Expo's servers, accessible via Expo Go app:

```bash
npx expo publish
```

Users can then scan the QR code with Expo Go to access your app.

#### Option B: Build APK for Android (Standalone App)
Build a standalone APK that can be installed directly on Android devices:

```bash
# Preview build (internal distribution)
eas build --platform android --profile preview

# Production build
eas build --platform android --profile production
```

The build will:
1. Upload your code to Expo servers
2. Build the APK in the cloud
3. Provide a download link when complete (usually 10-20 minutes)

#### Option C: Build AAB for Google Play Store
If you want to publish to Google Play Store:

```bash
eas build --platform android --profile production-aab
```

This creates an App Bundle (.aab) file required by Google Play.

#### Option D: Build for iOS
Build for iOS devices (requires Apple Developer account):

```bash
eas build --platform ios --profile production
```

### Step 4: Download and Test

After the build completes:

1. **For Expo Go**: Just scan the QR code with Expo Go app
2. **For APK**:
   - Download the APK from the link provided
   - Transfer to your Android device
   - Install and test
3. **For iOS**:
   - Download the IPA file
   - Install via TestFlight or direct installation

### Step 5: Distribute

#### For Internal Testing
Share the Expo Go link or APK download link with testers.

#### For Google Play Store
1. Build AAB: `eas build --platform android --profile production-aab`
2. Download the .aab file
3. Upload to Google Play Console
4. Submit for review

#### For Apple App Store
1. Build IPA: `eas build --platform ios --profile production`
2. Download the .ipa file
3. Upload to App Store Connect via Xcode or Transporter
4. Submit for review

## Quick Commands Reference

```bash
# Navigate to mobile directory
cd /home/pariharabhishek34/myshagun/mobile

# Login
npx expo login

# Check login status
npx expo whoami

# Publish to Expo Go
npx expo publish

# Build Android APK (preview/testing)
eas build --platform android --profile preview

# Build Android APK (production)
eas build --platform android --profile production

# Build Android AAB (Google Play)
eas build --platform android --profile production-aab

# Build iOS (production)
eas build --platform ios --profile production

# Check build status
eas build:list

# View project on Expo
npx expo open:web
```

## Updating Production API URL

Before deployment, update `config/api.js`:

```javascript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:5001/api'
  : 'https://api.myshagun.us/api'; // ← Update this URL
```

Options for production API:
1. **Your GCP VM**: Use your VM's public IP or domain
2. **Cloud Run**: Use your Cloud Run service URL
3. **Custom Domain**: Use api.myshagun.us or similar

Make sure:
- HTTPS is enabled (required for production)
- CORS is configured to allow your app
- Backend is accessible from the internet

## Testing Before Deployment

1. **Test locally first:**
   ```bash
   npm start
   # Test with Expo Go on your device
   ```

2. **Test all features:**
   - Registration (all 4 steps)
   - Email/Password Login
   - OTP Login
   - Profile browsing
   - Messaging
   - Profile management

3. **Test with production API:**
   - Temporarily set `__DEV__` to `false` in api.js
   - Test all API calls work with production backend
   - Switch back and rebuild

## Troubleshooting

### "Not logged in" error
```bash
npx expo login
# Enter credentials
```

### Build fails
```bash
# Check build logs
eas build:list

# Try clearing cache
rm -rf node_modules
npm install
```

### "Project not found" error
Your project is already configured with ID: `b458620b-e88f-4f8f-837f-75b4fcee8a04`
Make sure you're logged in as `abhishek1727`

### App crashes on production
- Check the production API URL is correct
- Verify backend is accessible
- Check console logs in Expo Go or device logs

## What's New in Version 1.1.0

✅ **Complete Registration Form**
- 4-step registration process
- All 17 profile fields matching web version
- Date picker for DOB
- Dropdown pickers for all selections

✅ **OTP Login Support**
- Users can login with OTP sent to email
- Toggle between password and OTP login
- Full integration with backend OTP endpoints

✅ **Improved UI**
- Better styling across all screens
- Enhanced user experience
- Progress indicators
- Better error handling

## Post-Deployment

After deploying:

1. **Share with testers**: Provide Expo Go link or APK
2. **Gather feedback**: Test on multiple devices
3. **Monitor errors**: Check Expo dashboard for crashes
4. **Update as needed**: Fix bugs and release new versions

## Next Version Planning

For version 1.2.0, consider:
- [ ] Profile photo upload
- [ ] Push notifications for messages
- [ ] Advanced search/filters
- [ ] Profile verification
- [ ] In-app purchases for premium features

---

**Ready to Deploy?** Follow the steps above starting with Step 1! 🚀
