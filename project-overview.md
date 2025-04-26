# Gym App Project Overview

## Project Structure

This is a monorepo built with Turborepo containing:

- **apps/**
  - **mobile/** - React Native/Expo mobile application
  - **api/** - Backend API service

- **packages/**
  - **app/** - Shared app components/logic
  - **app-config/** - Shared configuration
  - **tailwind-config/** - Shared Tailwind styling configuration
  - **typescript-config/** - Shared TypeScript configuration

## Tech Stack

### Mobile App
- **Framework**: React Native with Expo SDK 52
- **UI**: NativeWind (Tailwind CSS for React Native), Moti for animations
- **Navigation**: Expo Router
- **State Management**: Legend State, React Query, Redux Toolkit
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: i18next
- **Backend Communication**: React Query

### Development Workflow
- `yarn dev` - Run development server for API and mobile
- `yarn mobile#debug_ios_dev` - Debug iOS application
- `yarn mobile#debug_android_dev` - Debug Android application
- `yarn build` - Build applications
- `yarn test` - Run tests

## Getting Started

1. Install dependencies:
   ```
   yarn install
   ```

2. Start the development servers:
   ```
   yarn dev
   ```

3. For mobile development with iOS:
   ```
   yarn mobile#debug_ios_dev
   ```

4. For mobile development with Android:
   ```
   yarn mobile#debug_android_dev
   ```

## Project Features

Based on the dependencies, this gym app likely includes features such as:

- Workout planning and tracking
- User authentication and profiles
- Notifications for workouts
- Camera functionality (possibly for form checking or progress photos)
- Location services (possibly for gym locations)
- Data synchronization between devices

## Architecture

This project follows a monorepo architecture with shared packages for consistency across apps:

- Common UI components are in the `packages/app` directory
- Configuration is centralized in `packages/app-config`
- TypeScript and Tailwind configurations are shared across all applications

## Development Standards

- TypeScript for type safety
- Functional components with hooks
- NativeWind for styling
- Legend State for state management
- React Query for data fetching and caching
- Jest for testing 