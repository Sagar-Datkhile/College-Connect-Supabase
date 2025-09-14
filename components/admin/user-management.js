"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Check, X, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@college.edu",
      role: "student",
      status: "verified",
      graduationYear: "2024",
      major: "Computer Science",
      joinDate: "2024-01-15",
      lastActive: "2024-03-10",
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah.chen@college.edu",
      role: "alumni",
      status: "verified",
      graduationYear: "2020",
      major: "Computer Science",
      joinDate: "2024-02-01",
      lastActive: "2024-03-09",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@college.edu",
      role: "student",
      status: "pending",
      graduationYear: "2025",
      major: "Engineering",
      joinDate: "2024-03-05",
      lastActive: "2024-03-08",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@college.edu",
      role: "alumni",
      status: "pending",
      graduationYear: "2019",
      major: "Business",
      joinDate: "2024-03-01",
      lastActive: "2024-03-07",
    },
  ])

  const handleVerifyUser = (userId) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "verified" } : user)))
  }

  const handleRejectUser = (userId) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "rejected" } : user)))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="capitalize text-xs">
                      {user.role}
                    </Badge>
                    <Badge className={`${getStatusColor(user.status)} text-xs`}>{user.status}</Badge>
                    <span className="text-xs text-gray-500">
                      {user.major} • Class of {user.graduationYear}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleVerifyUser(user.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRejectUser(user.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Suspend User</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
