"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Flag, Check, X, Eye } from "lucide-react"

export function ContentModeration() {
  const [reports, setReports] = useState([
    {
      id: 1,
      type: "blog_post",
      title: "Inappropriate language in blog post",
      content: "Getting Started with React Development...",
      author: "John Doe",
      reporter: "Sarah Chen",
      reason: "Inappropriate content",
      status: "pending",
      reportDate: "2024-03-10",
      severity: "medium",
    },
    {
      id: 2,
      type: "discussion",
      title: "Spam in discussion room",
      content: "Check out this amazing opportunity...",
      author: "Mike Johnson",
      reporter: "Emily Rodriguez",
      reason: "Spam",
      status: "pending",
      reportDate: "2024-03-09",
      severity: "high",
    },
    {
      id: 3,
      type: "profile",
      title: "Fake profile information",
      content: "Profile claims false credentials",
      author: "Alex Smith",
      reporter: "David Wilson",
      reason: "False information",
      status: "pending",
      reportDate: "2024-03-08",
      severity: "high",
    },
  ])

  const handleApproveReport = (reportId) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "approved" } : report)))
  }

  const handleRejectReport = (reportId) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "rejected" } : report)))
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "blog_post":
        return "bg-blue-100 text-blue-800"
      case "discussion":
        return "bg-purple-100 text-purple-800"
      case "profile":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flag className="h-5 w-5 mr-2" />
          Content Moderation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports
            .filter((report) => report.status === "pending")
            .map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(report.type)}>{report.type.replace("_", " ")}</Badge>
                      <Badge className={getSeverityColor(report.severity)}>{report.severity} priority</Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{report.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{report.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Author: {report.author}</span>
                      <span>Reported by: {report.reporter}</span>
                      <span>Reason: {report.reason}</span>
                      <span>Date: {report.reportDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View Full Content
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApproveReport(report.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Take Action
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRejectReport(report.id)}>
                    <X className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          {reports.filter((report) => report.status === "pending").length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Flag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending reports</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
