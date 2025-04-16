# Gym App

A modern, full-stack gym management application built with React Native, Expo, and TypeScript. This monorepo project uses Turborepo for efficient development and deployment.

## 🚀 Features

- Mobile app for gym members and trainers
- API backend for data management
- Real-time workout tracking
- Exercise library and workout plans
- Progress tracking and analytics
- User authentication and profile management

## 🛠 Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Node.js, NestJs, TypeScript
- **Build Tool**: Turborepo
- **Mobile Development**: Expo EAS Build

## 📦 Project Structure

```
gym-app-turbo/
├── apps/
│   ├── mobile/     # React Native mobile app
│   └── api/        # Backend API
├── packages/       # Shared packages
├── scripts/        # Development scripts
└── patches/        # Package patches
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Yarn 1.22.22
- Expo CLI
- iOS/Android development environment (for mobile development)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd gym-app-turbo
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

#### Mobile App Development

```bash
# Start development server for mobile app
yarn mobile#debug_start_dev

# Debug on Android
yarn mobile#debug_android_dev

# Debug on iOS
yarn mobile#debug_ios_dev
```

#### API Development

```bash
# Start API server
yarn dev:api
```

### Building for Production

```bash
# Build Android APK
yarn mobile#build_android_prod

# Build Android AAB
yarn mobile#build_android_prodAab

# Build iOS IPA
yarn mobile#build_ios_prod
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch
```

## 🔧 Development Scripts

- `yarn clean` - Clean all build artifacts and dependencies
- `yarn clear-daemon` - Clear Turborepo daemon
- `yarn validate-package` - Validate package dependencies
- `yarn fix-expo-cannot-connect-to-backend` - Fix Expo backend connection issues

## 📝 Code Style

- TypeScript for type safety
- Biome for code formatting and linting
- Follow React Native and Expo best practices
- Use functional components and hooks
- Implement proper error handling and validation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
