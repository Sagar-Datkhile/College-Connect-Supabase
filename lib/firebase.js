import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getFunctions } from "firebase/functions"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Check if Firebase is properly configured
const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

let app, auth, db, storage, functions

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig)

  // Initialize Firebase services only if properly configured
  if (isFirebaseConfigured) {
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    functions = getFunctions(app)
  } else {
    console.warn("Firebase not configured. Please add environment variables.")
    // Create mock objects to prevent errors
    auth = null
    db = null
    storage = null
    functions = null
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Create mock objects to prevent errors
  auth = null
  db = null
  storage = null
  functions = null
}

export { auth, db, storage, functions }
export default app
