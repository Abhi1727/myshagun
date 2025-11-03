#!/bin/bash

# MyShagun Mobile App - Deployment Script
# This script helps deploy the mobile app to Expo

set -e

echo "🚀 MyShagun Mobile App - Deployment"
echo "===================================="
echo ""

# Check if we're in the mobile directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the mobile directory"
    exit 1
fi

# Check if user is logged in to Expo
echo "📝 Checking Expo login status..."
if ! npx expo whoami &>/dev/null; then
    echo "❌ Not logged in to Expo"
    echo ""
    echo "Please login first:"
    echo "  npx expo login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

EXPO_USER=$(npx expo whoami 2>/dev/null)
echo "✅ Logged in as: $EXPO_USER"
echo ""

# Show current configuration
echo "📋 Current Configuration:"
echo "  App: MyShagun"
echo "  Version: 1.1.0"
echo "  Package: com.myshagun.app"
echo "  Owner: abhishek1727"
echo "  Production API: https://api.myshagun.us/api"
echo ""

# Menu for deployment options
echo "🎯 Deployment Options:"
echo "  1) Publish to Expo Go (Quick testing)"
echo "  2) Build Android APK (Preview - for testing)"
echo "  3) Build Android APK (Production)"
echo "  4) Build Android AAB (Google Play Store)"
echo "  5) Build iOS (Production)"
echo "  6) View build status"
echo "  7) Cancel"
echo ""

read -p "Select an option (1-7): " choice

case $choice in
    1)
        echo ""
        echo "📤 Publishing to Expo Go..."
        echo "This will publish your app to Expo's servers."
        echo "Users can access it by scanning the QR code with Expo Go app."
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            npx expo publish
            echo ""
            echo "✅ Published! Share the QR code or link with users."
        fi
        ;;
    2)
        echo ""
        echo "🔨 Building Android APK (Preview)..."
        echo "This creates an APK for internal testing."
        echo "Build time: ~10-20 minutes"
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            eas build --platform android --profile preview
            echo ""
            echo "✅ Build started! You'll receive a download link when complete."
            echo "Check status: eas build:list"
        fi
        ;;
    3)
        echo ""
        echo "🔨 Building Android APK (Production)..."
        echo "This creates a production-ready APK."
        echo "Build time: ~10-20 minutes"
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            eas build --platform android --profile production
            echo ""
            echo "✅ Build started! You'll receive a download link when complete."
            echo "Check status: eas build:list"
        fi
        ;;
    4)
        echo ""
        echo "🔨 Building Android AAB (Google Play)..."
        echo "This creates an App Bundle for Google Play Store."
        echo "Build time: ~10-20 minutes"
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            eas build --platform android --profile production-aab
            echo ""
            echo "✅ Build started! You'll receive a download link when complete."
            echo "Upload the .aab file to Google Play Console."
        fi
        ;;
    5)
        echo ""
        echo "🔨 Building iOS (Production)..."
        echo "This creates a production IPA for App Store."
        echo "Build time: ~10-20 minutes"
        echo "⚠️  Requires Apple Developer account"
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            eas build --platform ios --profile production
            echo ""
            echo "✅ Build started! You'll receive a download link when complete."
            echo "Upload to App Store Connect for review."
        fi
        ;;
    6)
        echo ""
        echo "📊 Recent Builds:"
        eas build:list
        ;;
    7)
        echo "Cancelled."
        exit 0
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Done!"
echo ""
echo "📚 For more information, see DEPLOYMENT.md"
