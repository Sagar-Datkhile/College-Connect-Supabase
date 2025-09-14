"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Save, Database, Mail, Shield } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    autoApproveAlumni: false,
    requireEmailVerification: true,
    allowPublicRegistration: true,
    moderateAllPosts: false,
    maxFileUploadSize: "10",
    sessionTimeout: "24",
    maintenanceMode: false,
  })

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log("Saving settings:", settings)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-verification">Require Email Verification</Label>
              <p className="text-sm text-gray-500">Users must verify their email before accessing the platform</p>
            </div>
            <Switch
              id="email-verification"
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-approve">Auto-approve Alumni</Label>
              <p className="text-sm text-gray-500">Automatically verify alumni accounts with valid email domains</p>
            </div>
            <Switch
              id="auto-approve"
              checked={settings.autoApproveAlumni}
              onCheckedChange={(checked) => handleSettingChange("autoApproveAlumni", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public-registration">Allow Public Registration</Label>
              <p className="text-sm text-gray-500">Allow new users to register without invitation</p>
            </div>
            <Switch
              id="public-registration"
              checked={settings.allowPublicRegistration}
              onCheckedChange={(checked) => handleSettingChange("allowPublicRegistration", checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
            <Input
              id="session-timeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Content Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="moderate-posts">Moderate All Posts</Label>
              <p className="text-sm text-gray-500">Require admin approval for all blog posts and discussions</p>
            </div>
            <Switch
              id="moderate-posts"
              checked={settings.moderateAllPosts}
              onCheckedChange={(checked) => handleSettingChange("moderateAllPosts", checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-upload">Max File Upload Size (MB)</Label>
            <Input
              id="file-upload"
              type="number"
              value={settings.maxFileUploadSize}
              onChange={(e) => handleSettingChange("maxFileUploadSize", e.target.value)}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            System Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <p className="text-sm text-gray-500">Temporarily disable access for system maintenance</p>
            </div>
            <Switch
              id="maintenance-mode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send System Notification
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
