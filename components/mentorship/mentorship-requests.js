"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Check, X, MessageCircle, Calendar } from "lucide-react"

export function MentorshipRequests({ user }) {
  const [requests, setRequests] = useState([
    {
      id: 1,
      mentorName: "Sarah Chen",
      mentorTitle: "Senior Software Engineer at Google",
      status: "pending",
      requestDate: "2024-03-08",
      message:
        "Hi Sarah! I'm really interested in learning more about system design and would love your guidance as I prepare for technical interviews.",
      mentorResponse: null,
    },
    {
      id: 2,
      mentorName: "Michael Rodriguez",
      mentorTitle: "Product Manager at Microsoft",
      status: "accepted",
      requestDate: "2024-03-05",
      message: "Hello Michael! I'm exploring product management as a career path and would appreciate your insights.",
      mentorResponse: "Hi! I'd be happy to help. Let's schedule a call to discuss your interests and goals.",
      nextMeeting: "2024-03-15 2:00 PM",
    },
    {
      id: 3,
      mentorName: "Emily Johnson",
      mentorTitle: "Data Scientist at Netflix",
      status: "declined",
      requestDate: "2024-03-01",
      message: "Hi Emily! I'm interested in transitioning into data science and would love your mentorship.",
      mentorResponse:
        "Thanks for reaching out! Unfortunately, I'm at capacity with mentees right now, but I'd recommend checking out some online courses to get started.",
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <Check className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "declined":
        return <X className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Mentorship Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {request.mentorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.mentorName}</h4>
                    <p className="text-sm text-gray-600">{request.mentorTitle}</p>
                    <p className="text-xs text-gray-500">Requested on {request.requestDate}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(request.status)} flex items-center`}>
                  {getStatusIcon(request.status)}
                  <span className="ml-1 capitalize">{request.status}</span>
                </Badge>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Your message:</strong>
                </p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{request.message}</p>
              </div>

              {request.mentorResponse && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Mentor's response:</strong>
                  </p>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">{request.mentorResponse}</p>
                </div>
              )}

              {request.status === "accepted" && request.nextMeeting && (
                <div className="flex items-center space-x-2 mb-3 p-3 bg-green-50 rounded">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Next meeting: {request.nextMeeting}</span>
                </div>
              )}

              <div className="flex space-x-2">
                {request.status === "accepted" && (
                  <>
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Meeting
                    </Button>
                  </>
                )}
                {request.status === "pending" && (
                  <Button size="sm" variant="outline">
                    Cancel Request
                  </Button>
                )}
                {request.status === "declined" && (
                  <Button size="sm" variant="outline">
                    Find Similar Mentors
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
