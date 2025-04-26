# Environment Setup for Gym App

## Prerequisites

- Node.js v18+
- Yarn v1.22.22
- Xcode (for iOS development)
- Android Studio (for Android development)
- Expo CLI

## Installation Steps

1. Clone the repository

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Copy the template below and update with your own values:

   ```
   # API Configuration
   API_URL=http://localhost:3000
   
   # Firebase Configuration
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   
   # Feature Flags
   ENABLE_NOTIFICATIONS=true
   ENABLE_LOCATION=true
   ```

## iOS Setup

1. Install iOS dependencies:
   ```bash
   cd apps/mobile && npx pod-install
   ```

2. Start the iOS simulator:
   ```bash
   yarn mobile#debug_ios_dev
   ```

## Android Setup

1. Configure Android SDK:
   - Ensure ANDROID_HOME environment variable is set
   - Make sure Android SDK Platform 33+ is installed

2. Start an Android emulator or connect a physical device

3. Launch the app:
   ```bash
   yarn mobile#debug_android_dev
   ```

## Development Workflow

1. Start the API server:
   ```bash
   yarn dev:api
   ```

2. Start the mobile app:
   ```bash
   yarn dev
   ```

3. For simultaneous development of API and mobile:
   ```bash
   yarn dev:web
   ```

## Testing

1. Run unit tests:
   ```bash
   yarn test
   ```

2. Run tests in watch mode:
   ```bash
   yarn test:watch
   ```

## Build Configuration

1. Configure EAS Build (Expo Application Services):
   - Log in to Expo: `npx expo login`
   - Configure EAS in the project: `npx eas-cli configure`

2. Build for production:
   - Android APK: `yarn mobile#build_android_prod`
   - Android AAB: `yarn mobile#build_android_prodAab`
   - iOS: `yarn mobile#build_ios_prod`

## Troubleshooting

1. **Metro Bundler issues**:
   - Clear Metro cache: `npx expo start --clear`

2. **Cannot connect to development server**:
   - For Android: `yarn fix-expo-cannot-connect-to-backend`

3. **Dependency issues**:
   - Try a clean reinstall: `yarn clean` 