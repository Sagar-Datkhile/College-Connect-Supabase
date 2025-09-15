"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileView } from "./profile-view"
import { ProfileEditor } from "./profile-editor"
import { PrivacySettings } from "./privacy-settings"

export function ProfileDashboard({ user, isOwnProfile = true, onSaveProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const handleSaveProfile = async (profileData) => {
    if (onSaveProfile) {
      try {
        await onSaveProfile(profileData)
        setIsEditing(false)
      } catch (error) {
        console.error('Error saving profile:', error)
        // Keep editing mode active if save fails
      }
    } else {
      // Fallback behavior if no onSaveProfile prop provided
      console.log("Saving profile:", profileData)
      setIsEditing(false)
    }
  }

  const handleSavePrivacy = (privacySettings) => {
    // In a real app, this would save to backend
    console.log("Saving privacy settings:", privacySettings)
    // Show success message or update UI
  }

  const handleMessage = () => {
    // In a real app, this would open messaging interface
    console.log("Opening message interface")
  }

  const handleConnect = () => {
    // In a real app, this would send connection request
    console.log("Sending connection request")
  }

  if (isEditing) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <p className="text-gray-600">Update your profile information and preferences</p>
        </div>
        <ProfileEditor user={user} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />
      </div>
    )
  }

  if (!isOwnProfile) {
    return (
      <div>
        <ProfileView user={user} isOwnProfile={false} onMessage={handleMessage} onConnect={handleConnect} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-600">Manage your profile and privacy settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileView user={user} isOwnProfile={true} onEdit={() => setIsEditing(true)} />
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <PrivacySettings user={user} onSave={handleSavePrivacy} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
