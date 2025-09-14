"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Edit,
  MessageCircle,
  UserPlus,
  Award,
} from "lucide-react"

export function ProfileView({ user, isOwnProfile, onEdit, onMessage, onConnect }) {
  const socialLinks = [
    { icon: Globe, label: "Website", value: user.website, href: user.website },
    { icon: Linkedin, label: "LinkedIn", value: user.linkedin, href: `https://${user.linkedin}` },
    { icon: Github, label: "GitHub", value: user.github, href: `https://${user.github}` },
    { icon: Twitter, label: "Twitter", value: user.twitter, href: `https://${user.twitter}` },
  ].filter((link) => link.value)

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="text-4xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  {user.currentPosition && user.company && (
                    <p className="text-lg text-gray-600 mb-2">
                      {user.currentPosition} at {user.company}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {user.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {user.location}
                      </div>
                    )}
                    {user.graduationYear && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Class of {user.graduationYear}
                      </div>
                    )}
                    {user.major && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {user.major}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {isOwnProfile ? (
                    <Button onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={onMessage}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" onClick={onConnect}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {user.bio && (
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <link.icon className="h-4 w-4 mr-1" />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        {user.achievements && user.achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{achievement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Joined the Computer Science Study Group</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Connected with Sarah Chen as a mentor</p>
                <p className="text-xs text-gray-500">1 week ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Published a blog post about React best practices</p>
                <p className="text-xs text-gray-500">2 weeks ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
