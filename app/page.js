"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Users,
  MessageSquare,
  BookOpen,
  Shield,
  Settings,
  Bell,
  BarChart3,
  UserCheck,
} from "lucide-react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { MentorshipSuggestions } from "@/components/dashboard/mentorship-suggestions"
import { PlatformStats } from "@/components/admin/platform-stats"
import { UserManagement } from "@/components/admin/user-management"
import { ContentModeration } from "@/components/admin/content-moderation"
import { SystemSettings } from "@/components/admin/system-settings"
import { MentorshipDashboard } from "@/components/mentorship/mentorship-dashboard"
import { DiscussionDashboard } from "@/components/discussions/discussion-dashboard"
import { ProfileDashboard } from "@/components/profile/profile-dashboard"

export default function CollegePlatform() {
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState("dashboard")
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    graduationYear: "",
    major: "",
  })

  // Mock authentication
  const handleLogin = (e) => {
    e.preventDefault()
    const isAdmin = loginForm.email.includes("admin")
    setUser({
      id: 1,
      name: isAdmin ? "Admin User" : "John Doe",
      email: loginForm.email,
      role: isAdmin ? "admin" : "student",
      verified: true,
      graduationYear: "2024",
      major: "Computer Science",
    })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setUser({
      id: 2,
      name: registerForm.name,
      email: registerForm.email,
      role: registerForm.role,
      verified: false,
      graduationYear: registerForm.graduationYear,
      major: registerForm.major,
    })
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView("dashboard")
    setLoginForm({ email: "", password: "" })
    setRegisterForm({ name: "", email: "", password: "", role: "student", graduationYear: "", major: "" })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">College Connect</h1>
            <p className="text-gray-600">Connect with students, alumni, and mentors</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Sign in to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="Try admin@college.edu for admin access"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Join Our Community</CardTitle>
                  <CardDescription>Create your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                          id="role"
                          value={registerForm.role}
                          onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="student">Student</option>
                          <option value="alumni">Alumni</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Graduation Year</Label>
                        <Input
                          id="year"
                          value={registerForm.graduationYear}
                          onChange={(e) => setRegisterForm({ ...registerForm, graduationYear: e.target.value })}
                          placeholder="2024"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major/Field</Label>
                      <Input
                        id="major"
                        value={registerForm.major}
                        onChange={(e) => setRegisterForm({ ...registerForm, major: e.target.value })}
                        placeholder="Computer Science"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  if (user.role === "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">College Connect Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Badge variant="destructive">Admin</Badge>
                <span className="text-sm text-gray-700">{user.name}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          <nav className="w-64 bg-white shadow-sm min-h-screen border-r">
            <div className="p-4">
              <div className="space-y-2">
                <Button
                  variant={currentView === "dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentView("dashboard")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={currentView === "users" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentView("users")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </Button>
                <Button
                  variant={currentView === "moderation" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentView("moderation")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Content Moderation
                </Button>
                <Button
                  variant={currentView === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentView("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </div>
          </nav>

          <main className="flex-1 p-8">
            {currentView === "dashboard" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
                <PlatformStats />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UserManagement />
                  <ContentModeration />
                </div>
              </div>
            )}
            {currentView === "users" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
                <UserManagement />
              </div>
            )}
            {currentView === "moderation" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Moderation</h2>
                <ContentModeration />
              </div>
            )}
            {currentView === "settings" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
                <SystemSettings />
              </div>
            )}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">College Connect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("profile")}>
                <Settings className="h-4 w-4" />
              </Button>
              <Badge variant={user.verified ? "default" : "secondary"}>
                {user.verified ? "Verified" : "Pending Verification"}
              </Badge>
              <span className="text-sm text-gray-700">{user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "dashboard" && (
          <>
            <StatsCards user={user} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-gray-900">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Role</p>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Major</p>
                        <p className="text-gray-900">{user.major}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Graduation Year</p>
                        <p className="text-gray-900">{user.graduationYear}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4 bg-transparent"
                        onClick={() => setCurrentView("profile")}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                  <Card
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setCurrentView("mentorship")}
                  >
                    <CardContent className="p-6 text-center">
                      <UserCheck className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Find Mentors</h3>
                      <p className="text-sm text-gray-600">Connect with alumni and industry professionals</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setCurrentView("discussions")}
                  >
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Discussion Rooms</h3>
                      <p className="text-sm text-gray-600">Join conversations with your peers</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Blog & Resources</h3>
                      <p className="text-sm text-gray-600">Share knowledge and learn from others</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <RecentActivity user={user} />
                  <UpcomingEvents />
                </div>
                <MentorshipSuggestions user={user} />
              </div>
            </div>
          </>
        )}

        {currentView === "mentorship" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mentorship</h2>
              <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
                Back to Dashboard
              </Button>
            </div>
            <MentorshipDashboard user={user} />
          </div>
        )}

        {currentView === "discussions" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Discussions</h2>
              <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
                Back to Dashboard
              </Button>
            </div>
            <DiscussionDashboard user={user} />
          </div>
        )}

        {currentView === "profile" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
                <p className="text-gray-600">Manage your profile information and privacy settings</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
                Back to Dashboard
              </Button>
            </div>
            <ProfileDashboard user={user} />
          </div>
        )}
      </main>
    </div>
  )
}
