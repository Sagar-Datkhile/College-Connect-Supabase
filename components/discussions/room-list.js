"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Users, MessageCircle, Plus, Pin, TrendingUp } from "lucide-react"

export function RoomList({ onSelectRoom, onCreateRoom }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const rooms = [
    {
      id: 1,
      name: "Computer Science Study Group",
      description: "Discuss algorithms, data structures, and programming challenges",
      category: "Academic",
      memberCount: 156,
      messageCount: 1247,
      lastActivity: "2 minutes ago",
      isActive: true,
      isPinned: true,
      tags: ["CS", "Programming", "Study"],
      recentMessage: {
        author: "Sarah Chen",
        content: "Anyone working on the binary tree assignment?",
        timestamp: "2 min ago",
      },
    },
    {
      id: 2,
      name: "Career Advice & Job Search",
      description: "Share job opportunities, interview tips, and career guidance",
      category: "Career",
      memberCount: 289,
      messageCount: 2156,
      lastActivity: "5 minutes ago",
      isActive: true,
      isPinned: false,
      tags: ["Jobs", "Interviews", "Career"],
      recentMessage: {
        author: "Mike Johnson",
        content: "Just got an offer from Google! Happy to share my experience",
        timestamp: "5 min ago",
      },
    },
    {
      id: 3,
      name: "Alumni Network",
      description: "Connect with graduates and share professional experiences",
      category: "Networking",
      memberCount: 423,
      messageCount: 3892,
      lastActivity: "10 minutes ago",
      isActive: true,
      isPinned: true,
      tags: ["Alumni", "Networking", "Professional"],
      recentMessage: {
        author: "Emily Rodriguez",
        content: "Hosting a virtual networking event next week!",
        timestamp: "10 min ago",
      },
    },
    {
      id: 4,
      name: "Project Collaboration",
      description: "Find teammates for hackathons, side projects, and research",
      category: "Projects",
      memberCount: 98,
      messageCount: 567,
      lastActivity: "1 hour ago",
      isActive: false,
      isPinned: false,
      tags: ["Projects", "Collaboration", "Hackathon"],
      recentMessage: {
        author: "David Kim",
        content: "Looking for a React developer for my startup idea",
        timestamp: "1 hour ago",
      },
    },
    {
      id: 5,
      name: "General Discussion",
      description: "Casual conversations about campus life, events, and more",
      category: "General",
      memberCount: 512,
      messageCount: 4521,
      lastActivity: "30 minutes ago",
      isActive: false,
      isPinned: false,
      tags: ["General", "Campus", "Social"],
      recentMessage: {
        author: "Alex Thompson",
        content: "Anyone going to the spring festival this weekend?",
        timestamp: "30 min ago",
      },
    },
  ]

  const categories = ["all", "Academic", "Career", "Networking", "Projects", "General"]

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === "all" || room.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category) => {
    switch (category) {
      case "Academic":
        return "bg-blue-100 text-blue-800"
      case "Career":
        return "bg-green-100 text-green-800"
      case "Networking":
        return "bg-purple-100 text-purple-800"
      case "Projects":
        return "bg-orange-100 text-orange-800"
      case "General":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Discussion Rooms</h2>
        <Button onClick={onCreateRoom}>
          <Plus className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search rooms, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Room Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              room.isActive ? "ring-2 ring-green-200" : ""
            }`}
            onClick={() => onSelectRoom(room)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    {room.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                    {room.isActive && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {room.memberCount} members
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {room.messageCount} messages
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {room.lastActivity}
                    </div>
                  </div>
                </div>
                <Badge className={getCategoryColor(room.category)}>{room.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                {room.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              {room.recentMessage && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {room.recentMessage.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900">{room.recentMessage.author}</p>
                      <p className="text-xs text-gray-600 truncate">{room.recentMessage.content}</p>
                      <p className="text-xs text-gray-400">{room.recentMessage.timestamp}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
