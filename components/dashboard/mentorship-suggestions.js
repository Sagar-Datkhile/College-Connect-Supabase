import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin } from "lucide-react"

export function MentorshipSuggestions({ user }) {
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
      expertise: ["React", "System Design", "Career Growth"],
      bio: "Passionate about helping new graduates transition into tech careers.",
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
      expertise: ["Product Strategy", "Leadership", "Startups"],
      bio: "Former startup founder, now helping students explore product management.",
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
      expertise: ["Machine Learning", "Python", "Analytics"],
      bio: "Specializing in recommendation systems and data-driven decision making.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2" />
          Suggested Mentors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{mentor.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {mentor.title} at {mentor.company}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {mentor.location} • Class of {mentor.graduationYear}
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{mentor.bio}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {mentor.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Request Mentorship
                    </Button>
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
