"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Star, MapPin, MessageCircle } from "lucide-react"

export function MentorDiscovery({ onRequestMentorship }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterField, setFilterField] = useState("all")

  const mentors = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Senior Software Engineer",
      company: "Google",
      graduationYear: "2020",
      major: "Computer Science",
      location: "San Francisco, CA",
      rating: 4.9,
      reviewCount: 23,
      expertise: ["React", "System Design", "Career Growth", "Technical Interviews"],
      bio: "Passionate about helping new graduates transition into tech careers. I've mentored 15+ students and helped them land roles at top tech companies.",
      availability: "Available",
      responseTime: "Usually responds within 2 hours",
      menteeCount: 8,
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "Product Manager",
      company: "Microsoft",
      graduationYear: "2018",
      major: "Computer Science",
      location: "Seattle, WA",
      rating: 4.8,
      reviewCount: 31,
      expertise: ["Product Strategy", "Leadership", "Startups", "User Research"],
      bio: "Former startup founder, now helping students explore product management. I love sharing insights about building products that users love.",
      availability: "Limited",
      responseTime: "Usually responds within 1 day",
      menteeCount: 12,
    },
    {
      id: 3,
      name: "Emily Johnson",
      title: "Data Scientist",
      company: "Netflix",
      graduationYear: "2019",
      major: "Statistics",
      location: "Los Angeles, CA",
      rating: 4.9,
      reviewCount: 18,
      expertise: ["Machine Learning", "Python", "Analytics", "Research"],
      bio: "Specializing in recommendation systems and data-driven decision making. Happy to help students break into data science.",
      availability: "Available",
      responseTime: "Usually responds within 4 hours",
      menteeCount: 6,
    },
    {
      id: 4,
      name: "David Kim",
      title: "UX Designer",
      company: "Apple",
      graduationYear: "2017",
      major: "Design",
      location: "Cupertino, CA",
      rating: 4.7,
      reviewCount: 25,
      expertise: ["UI/UX Design", "Design Systems", "User Research", "Prototyping"],
      bio: "Passionate about creating intuitive user experiences. I've worked on products used by millions of people worldwide.",
      availability: "Available",
      responseTime: "Usually responds within 6 hours",
      menteeCount: 10,
    },
  ]

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterField === "all" || mentor.major.toLowerCase().includes(filterField.toLowerCase())
    return matchesSearch && matchesFilter
  })

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Limited":
        return "bg-yellow-100 text-yellow-800"
      case "Unavailable":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Fields</option>
              <option value="computer science">Computer Science</option>
              <option value="statistics">Statistics</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Mentor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                    <Badge className={getAvailabilityColor(mentor.availability)}>{mentor.availability}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {mentor.title} at {mentor.company}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <MapPin className="h-3 w-3 mr-1" />
                    {mentor.location} • Class of {mentor.graduationYear}
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {mentor.rating} ({mentor.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{mentor.menteeCount} mentees</div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mentor.bio}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-4">{mentor.responseTime}</div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => onRequestMentorship(mentor)}
                      disabled={mentor.availability === "Unavailable"}
                    >
                      Request Mentorship
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
