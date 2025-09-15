import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// Check if we have Firebase Admin credentials
const hasAdminCredentials = 
  process.env.FIREBASE_ADMIN_PROJECT_ID &&
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
  process.env.FIREBASE_ADMIN_PRIVATE_KEY

let firebaseAdminConfig

if (hasAdminCredentials) {
  // Use service account credentials
  firebaseAdminConfig = {
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  }
} else if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  // Fallback: use project ID with default credentials (for development)
  firebaseAdminConfig = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  }
} else {
  throw new Error('Firebase configuration is incomplete. Please check your environment variables.')
}

// Initialize Firebase Admin SDK
function createFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  return initializeApp(firebaseAdminConfig)
}

let adminApp, adminAuth, adminDb, adminStorage

try {
  adminApp = createFirebaseAdminApp()
  adminAuth = getAuth(adminApp)
  adminDb = getFirestore(adminApp)
  adminStorage = getStorage(adminApp)
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error)
  // For development, we'll export null values to prevent build errors
  adminApp = null
  adminAuth = null
  adminDb = null
  adminStorage = null
}

// Export Firebase Admin services
export { adminAuth, adminDb, adminStorage }
export default adminApp
