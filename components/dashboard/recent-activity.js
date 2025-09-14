import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MessageCircle, UserPlus, BookOpen } from "lucide-react"

export function RecentActivity({ user }) {
  const activities = [
    {
      id: 1,
      type: "message",
      title: "New message from Sarah Chen",
      description: "Alumni from Computer Science '22",
      time: "2 hours ago",
      icon: MessageCircle,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "connection",
      title: "Connection request accepted",
      description: "Mike Johnson is now in your network",
      time: "5 hours ago",
      icon: UserPlus,
      color: "text-green-600",
    },
    {
      id: 3,
      type: "post",
      title: "Your blog post was liked",
      description: "Getting Started with React - 15 likes",
      time: "1 day ago",
      icon: BookOpen,
      color: "text-purple-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-full bg-gray-100`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
