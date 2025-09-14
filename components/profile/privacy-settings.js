"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Eye, Mail, Bell, Save } from "lucide-react"

export function PrivacySettings({ user, onSave }) {
  const [settings, setSettings] = useState({
    profileVisibility: user.profileVisibility || "public",
    showEmail: user.showEmail || false,
    showLocation: user.showLocation || true,
    showGraduationYear: user.showGraduationYear || true,
    allowMessages: user.allowMessages || true,
    allowMentorshipRequests: user.allowMentorshipRequests || true,
    emailNotifications: user.emailNotifications || true,
    pushNotifications: user.pushNotifications || true,
    mentorshipNotifications: user.mentorshipNotifications || true,
    discussionNotifications: user.discussionNotifications || false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(settings)
  }

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Profile Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Who can see your profile?</Label>
            <select
              id="profile-visibility"
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Everyone</option>
              <option value="college">College community only</option>
              <option value="connections">Connections only</option>
              <option value="private">Only me</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-email">Show email address</Label>
                <p className="text-sm text-gray-500">Allow others to see your email address</p>
              </div>
              <Switch
                id="show-email"
                checked={settings.showEmail}
                onCheckedChange={(checked) => handleSettingChange("showEmail", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-location">Show location</Label>
                <p className="text-sm text-gray-500">Display your location on your profile</p>
              </div>
              <Switch
                id="show-location"
                checked={settings.showLocation}
                onCheckedChange={(checked) => handleSettingChange("showLocation", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-graduation">Show graduation year</Label>
                <p className="text-sm text-gray-500">Display your graduation year publicly</p>
              </div>
              <Switch
                id="show-graduation"
                checked={settings.showGraduationYear}
                onCheckedChange={(checked) => handleSettingChange("showGraduationYear", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-messages">Allow direct messages</Label>
              <p className="text-sm text-gray-500">Let other users send you direct messages</p>
            </div>
            <Switch
              id="allow-messages"
              checked={settings.allowMessages}
              onCheckedChange={(checked) => handleSettingChange("allowMessages", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-mentorship">Allow mentorship requests</Label>
              <p className="text-sm text-gray-500">Let students send you mentorship requests</p>
            </div>
            <Switch
              id="allow-mentorship"
              checked={settings.allowMentorshipRequests}
              onCheckedChange={(checked) => handleSettingChange("allowMentorshipRequests", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="mentorship-notifications">Mentorship updates</Label>
              <p className="text-sm text-gray-500">Get notified about mentorship activities</p>
            </div>
            <Switch
              id="mentorship-notifications"
              checked={settings.mentorshipNotifications}
              onCheckedChange={(checked) => handleSettingChange("mentorshipNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="discussion-notifications">Discussion updates</Label>
              <p className="text-sm text-gray-500">Get notified about new messages in discussions you follow</p>
            </div>
            <Switch
              id="discussion-notifications"
              checked={settings.discussionNotifications}
              onCheckedChange={(checked) => handleSettingChange("discussionNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Download my data
            </Button>
            <p className="text-sm text-gray-500">Download a copy of all your data</p>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent">
              Delete my account
            </Button>
            <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </form>
  )
}
