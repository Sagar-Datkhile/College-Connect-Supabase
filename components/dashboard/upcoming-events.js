import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"

export function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "Tech Career Fair",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Student Center",
      attendees: 150,
      type: "Career",
    },
    {
      id: 2,
      title: "Alumni Networking Night",
      date: "March 20, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Downtown Hotel",
      attendees: 75,
      type: "Networking",
    },
    {
      id: 3,
      title: "CS Department Seminar",
      date: "March 25, 2024",
      time: "2:00 PM - 3:30 PM",
      location: "Engineering Building",
      attendees: 45,
      type: "Academic",
    },
  ]

  const getTypeColor = (type) => {
    switch (type) {
      case "Career":
        return "bg-blue-100 text-blue-800"
      case "Networking":
        return "bg-green-100 text-green-800"
      case "Academic":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {event.date} • {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {event.attendees} attending
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                Register
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
