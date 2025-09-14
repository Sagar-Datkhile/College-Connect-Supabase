"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"

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

  // Check if Firebase is available
  const isFirebaseAvailable = auth && db

  // Mock sign up function when Firebase is not available
  const signUp = async (email, password, userData) => {
    if (!isFirebaseAvailable) {
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
      return { user: mockUser, message: "Demo account created! Firebase not configured." }
    }

    try {
      const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import("firebase/auth")
      const { doc, setDoc } = await import("firebase/firestore")

      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(user, { displayName: userData.name })

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: userData.name,
        email: user.email,
        role: userData.role,
        major: userData.major,
        graduationYear: userData.graduationYear,
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        profileComplete: false,
        bio: "",
        skills: [],
        interests: [],
        socialLinks: {},
        mentorshipStatus: userData.role === "alumni" ? "available" : "seeking",
      })

      await sendEmailVerification(user)

      return { user, message: "Account created successfully! Please check your email for verification." }
    } catch (error) {
      throw error
    }
  }

  // Mock sign in function when Firebase is not available
  const signIn = async (email, password) => {
    if (!isFirebaseAvailable) {
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
      return { user: mockUser }
    }

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      return { user }
    } catch (error) {
      throw error
    }
  }

  // Mock logout function
  const logout = async () => {
    if (!isFirebaseAvailable) {
      setUser(null)
      setUserProfile(null)
      return
    }

    try {
      const { signOut } = await import("firebase/auth")
      await signOut(auth)
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      throw error
    }
  }

  // Mock update profile function
  const updateUserProfile = async (updates) => {
    if (!isFirebaseAvailable) {
      setUserProfile((prev) => ({ ...prev, ...updates }))
      return
    }

    try {
      const { doc, updateDoc } = await import("firebase/firestore")
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          ...updates,
          updatedAt: new Date(),
        })
        setUserProfile((prev) => ({ ...prev, ...updates }))
      }
    } catch (error) {
      throw error
    }
  }

  // Mock fetch user profile function
  const fetchUserProfile = async (uid) => {
    if (!isFirebaseAvailable) {
      return userProfile
    }

    try {
      const { doc, getDoc } = await import("firebase/firestore")
      const docRef = doc(db, "users", uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const profile = docSnap.data()
        setUserProfile(profile)
        return profile
      } else {
        console.log("No user profile found")
        return null
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw error
    }
  }

  // Listen for authentication state changes
  useEffect(() => {
    if (!isFirebaseAvailable) {
      setLoading(false)
      return
    }

    const { onAuthStateChanged } = require("firebase/auth")
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        await fetchUserProfile(user.uid)
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [isFirebaseAvailable])

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    logout,
    updateUserProfile,
    fetchUserProfile,
    isFirebaseAvailable,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
