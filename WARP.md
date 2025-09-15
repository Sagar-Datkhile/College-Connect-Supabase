# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

College Connect is a Next.js-based college community platform that enables students, alumni, and mentors to connect. The application features user authentication via Firebase, role-based access control (student, alumni, admin), and various community features including discussions, mentorship matching, and profile management.

**Key Technologies:**
- Next.js 14.2+ (React 18, App Router)
- Firebase (Authentication, Firestore, Storage, Functions)
- TailwindCSS with Radix UI components
- TypeScript/JavaScript hybrid
- Vercel deployment

## Architecture Overview

### Directory Structure
- `app/` - Next.js 14 App Router pages and API routes
  - `api/` - Backend API routes for users, discussions, mentorship
  - Authentication pages at `/login` and `/signup`
- `components/` - React components organized by feature
  - `admin/` - Admin-only components (user management, moderation)
  - `dashboard/` - Main dashboard components
  - `discussions/` - Discussion forum components
  - `mentorship/` - Mentorship system components
  - `profile/` - User profile components
  - `ui/` - Reusable UI components (Radix UI based)
- `contexts/` - React contexts (primarily AuthContext)
- `lib/` - Utility libraries
  - `firebase.js` - Client Firebase configuration
  - `firebase-admin.js` - Server-side Firebase Admin SDK
- `functions/` - Firebase Cloud Functions
- `styles/` - Global CSS files

### Authentication System
The app uses Firebase Authentication with fallback mock authentication when Firebase is not configured:
- `AuthContext` provides authentication state management
- Supports email/password authentication
- Role-based access (student, alumni, admin)
- Admin users are identified by email containing "admin"

### Firebase Integration
- **Firestore**: User profiles, discussions, mentorship data
- **Authentication**: User registration and login
- **Storage**: File uploads and media storage
- **Functions**: Server-side business logic (Node.js 18)
- **Hosting**: Configured for static export deployment

### Component Architecture
- Uses Radix UI primitives with custom styling
- Shadcn/ui component library pattern
- Feature-based component organization
- Client-side state management via React hooks and context

## Common Development Commands

### Setup and Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Firebase Commands
```bash
# Deploy to Firebase
firebase deploy

# Deploy functions only
firebase deploy --only functions

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Local Firebase emulator
firebase emulators:start

# Initialize Firebase project
firebase init
```

### Environment Setup
Required environment variables in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# For admin functionality
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

## Development Guidelines

### Authentication Flow
- Mock authentication is used when Firebase env vars are not configured
- Login with email containing "admin" grants admin privileges
- All API routes require Firebase ID token validation for admin functions

### Component Development
- Use existing UI components from `components/ui/`
- Follow feature-based organization in component folders
- Maintain TypeScript types where applicable (mixed TS/JS codebase)
- Use TailwindCSS for styling with consistent design patterns

### API Route Development
- API routes are in `app/api/` using Next.js 14 App Router
- Admin routes require token verification via `firebase-admin`
- Use consistent error handling and response formats
- Mock data fallbacks when Firebase is unavailable

### Database Schema
User profiles include:
- Basic info: name, email, role, major, graduationYear
- Profile: bio, skills, interests, socialLinks
- Status: verified, profileComplete, mentorshipStatus
- Timestamps: createdAt, updatedAt

### Deployment
- Configured for Vercel deployment (primary)
- Firebase Hosting configured as alternative
- Static export support enabled
- Build process ignores TypeScript/ESLint errors for demo purposes

## Firebase Configuration

The project supports both full Firebase integration and demo mode:
- When properly configured, uses full Firebase services
- Without configuration, falls back to mock implementations
- This allows the project to run and demonstrate functionality without Firebase setup
