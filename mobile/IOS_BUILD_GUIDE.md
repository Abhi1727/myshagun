# MyShagun iOS App - Build Guide

Since you're on **Linux**, you cannot run iOS Simulator locally (requires macOS). However, you have several options to build and test your iOS app.

## 🍎 iOS Build Options

### Option 1: Build with EAS Build (Recommended) ☁️

EAS Build is Expo's cloud build service that builds your iOS app on their servers.

#### Prerequisites:
- Expo account (✅ You have: abhishek1727)
- Apple Developer account ($99/year) - **Required for App Store**
- OR just build for testing (free with Expo Go)

#### Steps to Build:

**A. For Testing with Expo Go (Free)**

1. **Open a terminal and run:**
```bash
cd /home/pariharabhishek34/myshagun/mobile

# Login to Expo
npx expo login

# Build for iOS (development/testing)
eas build --platform ios --profile development
```

This creates a development build that you can install on a physical iOS device registered in your Apple Developer account.

**B. For App Store Distribution**

1. **You need an Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com

2. **Configure Apple credentials in EAS:**
```bash
eas credentials
```

3. **Build for production:**
```bash
eas build --platform ios --profile production
```

4. **Wait for build** (~15-20 minutes)
   - EAS will build your app in the cloud
   - You'll get a download link when done

5. **Submit to App Store:**
```bash
eas submit --platform ios
```

#### Build Profiles Available:

- **`development`**: For testing on registered devices
- **`preview`**: Internal distribution (TestFlight)
- **`production`**: App Store release

### Option 2: Test with Expo Go (Easiest) 📱

**No Apple Developer account needed!**

1. **Install Expo Go on your iPhone:**
   - Download from App Store: https://apps.apple.com/app/expo-go/id982107779

2. **Start your dev server:**
```bash
cd /home/pariharabhishek34/myshagun/mobile
npx expo start
```

3. **Scan QR Code:**
   - Open Expo Go on your iPhone
   - Tap "Scan QR Code"
   - Scan the QR code from your terminal
   - Make sure iPhone and computer are on same WiFi

4. **Test your app!**
   - All features will work
   - Test registration, login, OTP, etc.

This is the **quickest way** to test on iOS without any accounts or builds!

### Option 3: Build on a Mac (If You Have Access)

If you have access to a Mac:

1. **Install Xcode** (from Mac App Store)
2. **Install Xcode Command Line Tools:**
```bash
xcode-select --install
```
3. **Open your project:**
```bash
cd /home/pariharabhishek34/myshagun/mobile
npx expo run:ios
```

## 🔧 Current Configuration

Your app is already configured for iOS:

**App Details:**
- **Bundle ID**: `com.myshagun.app`
- **App Name**: MyShagun
- **Version**: 1.1.0
- **Owner**: abhishek1727
- **Expo Project ID**: b458620b-e88f-4f8f-837f-75b4fcee8a04

**iOS Settings** (in app.json):
```json
{
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.myshagun.app",
    "config": {
      "usesNonExemptEncryption": false
    }
  }
}
```

## 📋 Step-by-Step: Build iOS App with EAS

Since you're on Linux, here's the complete process:

### Step 1: Verify Login
```bash
cd /home/pariharabhishek34/myshagun/mobile
npx expo whoami
# Should show: abhishek1727
```

### Step 2: Choose Build Type

**For Testing (No Apple Developer needed):**
```bash
# Build for Expo Go testing
npx expo start
# Then use Expo Go app to scan QR code
```

**For Standalone App (Apple Developer account required):**
```bash
# Build development IPA
eas build --platform ios --profile development

# OR build production IPA
eas build --platform ios --profile production
```

### Step 3: Wait for Build
- Build takes 15-20 minutes
- You'll see progress in terminal
- Download link will be provided when complete

### Step 4: Install on Device

**Option A: Via TestFlight (Recommended)**
1. Submit to TestFlight:
```bash
eas submit --platform ios --latest
```
2. Testers install from TestFlight app

**Option B: Direct Install**
1. Download .ipa file from EAS
2. Use Apple Configurator or Xcode
3. Install on registered device

## 💰 Cost Breakdown

| Method | Cost | What You Need |
|--------|------|---------------|
| **Expo Go** | Free | Just Expo Go app |
| **EAS Build** | Free tier available | Expo account |
| **App Store** | $99/year | Apple Developer account |

**Recommendation for Testing:**
- Start with **Expo Go** (free, instant)
- Then build with **EAS** if you need standalone app
- Only get Apple Developer if publishing to App Store

## 🚀 Quick Start: Test Now!

**Fastest way to test your iOS app right now:**

1. **On your iPhone, download:** [Expo Go](https://apps.apple.com/app/expo-go/id982107779)

2. **In your terminal:**
```bash
cd /home/pariharabhishek34/myshagun/mobile
npx expo start
```

3. **Scan QR code** with Expo Go app

4. **Test your app!**
   - ✅ Registration (4-step form)
   - ✅ Email/Password Login
   - ✅ OTP Login
   - ✅ Profile browsing
   - ✅ Messaging

## 🔑 Apple Developer Account Setup (If Publishing)

If you want to publish to App Store:

1. **Sign up for Apple Developer Program:**
   - Visit: https://developer.apple.com/programs/
   - Cost: $99/year
   - Processing: 1-2 days

2. **Configure in EAS:**
```bash
eas credentials
```

3. **Follow prompts to add:**
   - Distribution certificate
   - Provisioning profile
   - App Store Connect API key

## 🐛 Troubleshooting

### "No Apple Developer account"
- Use Expo Go for testing (no account needed)
- Sign up at https://developer.apple.com to publish

### "Build failed"
```bash
# Check build logs
eas build:list

# View specific build
eas build:view [BUILD_ID]
```

### "Cannot install IPA"
- Must use registered device in Apple Developer portal
- OR use TestFlight for easier distribution

### "Project not configured for iOS"
- Already configured! ✅
- Bundle ID: com.myshagun.app

## 📱 Recommended Testing Flow

1. **Week 1**: Test with Expo Go (free, instant feedback)
2. **Week 2**: Build with EAS when ready for beta testing
3. **Week 3**: Get Apple Developer account if publishing
4. **Week 4**: Submit to App Store

## 🎯 Next Steps

**To test your iOS app RIGHT NOW:**

```bash
# In your terminal
cd /home/pariharabhishek34/myshagun/mobile
npx expo start

# On your iPhone
# 1. Download Expo Go from App Store
# 2. Open Expo Go
# 3. Scan the QR code
# 4. App loads and you can test!
```

**To build standalone iOS app:**

```bash
# For testing
eas build --platform ios --profile development

# For production
eas build --platform ios --profile production
```

---

**Need Help?**
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- iOS Setup: https://docs.expo.dev/build/setup/
- Submit to App Store: https://docs.expo.dev/submit/introduction/
