"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, db, isFirebaseConfigured } from "@/lib/firebase"

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sign up function with Firebase or mock implementation
  const signUp = async (email, password, userData) => {
    setError(null)
    setLoading(true)

    try {
      if (!isFirebaseConfigured || !auth || !db) {
        // Mock implementation for demo
        const mockUser = {
          uid: "mock-uid-" + Date.now(),
          email: email,
          displayName: userData.name,
          emailVerified: false,
        }
        setUser(mockUser)
        setUserProfile({
          uid: mockUser.uid,
          name: userData.name,
          email: email,
          role: userData.role,
          major: userData.major,
          graduationYear: userData.graduationYear,
          verified: false,
          createdAt: new Date(),
        })
        setLoading(false)
        return { user: mockUser, message: "Demo account created! Firebase not configured." }
      }

      const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import("firebase/auth")
      const { doc, setDoc } = await import("firebase/firestore")

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await updateProfile(user, { displayName: userData.name })

      // Create user profile in Firestore
      const userProfileData = {
        uid: user.uid,
        name: userData.name,
        email: user.email,
        role: userData.role || "student",
        major: userData.major || "",
        graduationYear: userData.graduationYear || "",
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        profileComplete: false,
        bio: "",
        skills: [],
        interests: [],
        socialLinks: {},
        mentorshipStatus: userData.role === "alumni" ? "available" : "seeking",
      }

      await setDoc(doc(db, "users", user.uid), userProfileData)
      setUserProfile(userProfileData)

      // Send email verification
      try {
        await sendEmailVerification(user)
      } catch (emailError) {
        console.warn("Could not send verification email:", emailError)
      }

      setLoading(false)
      return { user, message: "Account created successfully! Please check your email for verification." }
    } catch (error) {
      setLoading(false)
      setError(error.message)
      throw new Error(error.message || "Failed to create account")
    }
  }

  // Sign in function with Firebase or mock implementation
  const signIn = async (email, password) => {
    setError(null)
    setLoading(true)

    try {
      if (!isFirebaseConfigured || !auth || !db) {
        // Mock implementation for demo
        const isAdmin = email.includes("admin")
        const mockUser = {
          uid: "mock-uid-" + Date.now(),
          email: email,
          displayName: isAdmin ? "Admin User" : "Demo User",
          emailVerified: true,
        }
        setUser(mockUser)
        setUserProfile({
          uid: mockUser.uid,
          name: mockUser.displayName,
          email: email,
          role: isAdmin ? "admin" : "student",
          major: "Computer Science",
          graduationYear: "2024",
          verified: true,
          createdAt: new Date(),
        })
        setLoading(false)
        return { user: mockUser }
      }

      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Fetch user profile after successful login
      await fetchUserProfile(user.uid)
      
      setLoading(false)
      return { user }
    } catch (error) {
      setLoading(false)
      setError(error.message)
      throw new Error(error.message || "Failed to sign in")
    }
  }

  // Logout function
  const logout = async () => {
    setError(null)
    
    try {
      if (!isFirebaseConfigured || !auth) {
        // Mock implementation
        setUser(null)
        setUserProfile(null)
        return
      }

      const { signOut } = await import("firebase/auth")
      await signOut(auth)
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      setError(error.message)
      throw new Error(error.message || "Failed to sign out")
    }
  }

  // Update user profile function
  const updateUserProfile = async (updates) => {
    setError(null)
    
    try {
      if (!isFirebaseConfigured || !db) {
        // Mock implementation
        setUserProfile((prev) => ({ ...prev, ...updates }))
        return
      }

      if (!user) {
        throw new Error("No user logged in")
      }

      const { doc, updateDoc, setDoc, getDoc } = await import("firebase/firestore")
      const userDocRef = doc(db, "users", user.uid)
      
      // Check if user document exists
      const docSnap = await getDoc(userDocRef)
      
      if (docSnap.exists()) {
        // Update existing document
        await updateDoc(userDocRef, {
          ...updates,
          updatedAt: new Date(),
        })
      } else {
        // Create new document if it doesn't exist
        const newProfile = {
          uid: user.uid,
          name: updates.name || user.displayName || '',
          email: user.email,
          role: updates.role || 'student',
          createdAt: new Date(),
          updatedAt: new Date(),
          profileComplete: false,
          bio: '',
          skills: [],
          interests: [],
          socialLinks: {},
          mentorshipStatus: 'seeking',
          ...updates
        }
        await setDoc(userDocRef, newProfile)
      }
      
      // Update local state
      setUserProfile((prev) => ({ 
        ...prev, 
        ...updates, 
        updatedAt: new Date() 
      }))
      
      console.log('Profile updated successfully in Firebase')
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message)
      throw new Error(error.message || "Failed to update profile")
    }
  }

  // Fetch user profile function
  const fetchUserProfile = async (uid) => {
    if (!isFirebaseConfigured || !db) {
      return userProfile
    }

    try {
      const { doc, getDoc } = await import("firebase/firestore")
      const docRef = doc(db, "users", uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const profile = docSnap.data()
        setUserProfile(profile)
        console.log('User profile fetched successfully:', profile)
        return profile
      } else {
        console.log("No user profile found for uid:", uid)
        console.log("Profile will be created on first update")
        setUserProfile(null)
        return null
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      setError(error.message)
      return null
    }
  }

  // Listen for authentication state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const { onAuthStateChanged } = require("firebase/auth")
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user)
          await fetchUserProfile(user.uid)
        } else {
          setUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error("Auth state change error:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [isFirebaseConfigured])

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    logout,
    updateUserProfile,
    fetchUserProfile,
    isFirebaseConfigured,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
