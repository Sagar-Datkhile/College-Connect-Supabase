"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MentorDiscovery } from "./mentor-discovery"
import { MentorshipRequests } from "./mentorship-requests"
import { RequestModal } from "./request-modal"
import { Users, MessageSquare, Calendar, TrendingUp } from "lucide-react"

export function MentorshipDashboard({ user }) {
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  const handleRequestMentorship = (mentor) => {
    setSelectedMentor(mentor)
    setIsRequestModalOpen(true)
  }

  const handleSubmitRequest = (mentor, formData) => {
    // In a real app, this would send the request to the backend
    console.log("Mentorship request submitted:", { mentor, formData })
    // Show success message or update UI
  }

  const stats = [
    {
      title: "Active Mentorships",
      value: "2",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Requests",
      value: "1",
      icon: MessageSquare,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Scheduled Meetings",
      value: "3",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Goals Achieved",
      value: "5",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discover">Discover Mentors</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-6">
          <MentorDiscovery onRequestMentorship={handleRequestMentorship} />
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <MentorshipRequests user={user} />
        </TabsContent>
      </Tabs>

      {/* Request Modal */}
      <RequestModal
        mentor={selectedMentor}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleSubmitRequest}
      />
    </div>
  )
}
