"use client"

import { createContext, useContext, useEffect, useState } from "react"
import supabase, { isSupabaseConfigured } from "@/lib/supabase"

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

  // Sign up function with Supabase or mock implementation
  const signUp = async (email, password, userData) => {
    setError(null)
    setLoading(true)

    try {
      if (!isSupabaseConfigured || !supabase) {
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
        return { user: mockUser, message: "Demo account created! Supabase not configured." }
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { name: userData.name } } })
      if (signUpError) throw signUpError

      const authUser = signUpData.user
      const userProfileData = {
        id: authUser.id,
        uid: authUser.id,
        name: userData.name,
        email: authUser.email,
        role: userData.role || "student",
        major: userData.major || "",
        graduationYear: userData.graduationYear || "",
        verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile_complete: false,
        bio: "",
        skills: [],
        interests: [],
        social_links: {},
        mentorship_status: userData.role === "alumni" ? "available" : "seeking",
      }

      const { error: profileError } = await supabase.from("users").insert(userProfileData)
      if (profileError) throw profileError
      setUserProfile(userProfileData)

      setLoading(false)
      return { user: authUser, message: "Account created successfully! Please check your email for verification." }
    } catch (error) {
      setLoading(false)
      setError(error.message)
      throw new Error(error.message || "Failed to create account")
    }
  }

  // Sign in function with Supabase or mock implementation
  const signIn = async (email, password) => {
    setError(null)
    setLoading(true)

    try {
      if (!isSupabaseConfigured || !supabase) {
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

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError
      const authUser = signInData.user

      await fetchUserProfile(authUser.id)

      setLoading(false)
      return { user: authUser }
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
      if (!isSupabaseConfigured || !supabase) {
        // Mock implementation
        setUser(null)
        setUserProfile(null)
        return
      }

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
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
      if (!isSupabaseConfigured || !supabase) {
        // Mock implementation
        setUserProfile((prev) => ({ ...prev, ...updates }))
        return
      }

      if (!user) {
        throw new Error("No user logged in")
      }

      const { data: existing, error: selectError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id || user.uid)
        .single()
      if (selectError && selectError.code !== 'PGRST116') throw selectError

      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from("users")
          .update(payload)
          .eq("id", user.id || user.uid)
        if (updateError) throw updateError
      } else {
        const newProfile = {
          id: user.id || user.uid,
          uid: user.id || user.uid,
          name: updates.name || user.user_metadata?.name || '',
          email: user.email,
          role: updates.role || 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profile_complete: false,
          bio: '',
          skills: [],
          interests: [],
          social_links: {},
          mentorship_status: 'seeking',
          ...updates
        }
        const { error: insertError } = await supabase.from("users").insert(newProfile)
        if (insertError) throw insertError
      }
      
      // Update local state
      setUserProfile((prev) => ({ 
        ...prev, 
        ...updates, 
        updatedAt: new Date() 
      }))
      
      console.log('Profile updated successfully in Supabase')
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message)
      throw new Error(error.message || "Failed to update profile")
    }
  }

  // Fetch user profile function
  const fetchUserProfile = async (uid) => {
    if (!isSupabaseConfigured || !supabase) {
      return userProfile
    }

    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", uid).single()
      if (error) {
        if (error.code === 'PGRST116') {
          setUserProfile(null)
          return null
        }
        throw error
      }
      setUserProfile(data)
      return data
    } catch (error) {
      console.error("Error fetching user profile:", error)
      setError(error.message)
      return null
    }
  }

  // Listen for authentication state changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const authUser = session?.user || null
        setUser(authUser)
        if (authUser) {
          await fetchUserProfile(authUser.id)
        } else {
          setUserProfile(null)
        }
      } catch (error) {
        console.error("Auth state change error:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      authListener.subscription?.unsubscribe?.()
    }
  }, [isSupabaseConfigured])

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
    isSupabaseConfigured,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
