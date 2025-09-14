"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, MapPin } from "lucide-react"

export function RequestModal({ mentor, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    goals: "",
    timeCommitment: "1-2 hours per month",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(mentor, formData)
    setFormData({
      subject: "",
      message: "",
      goals: "",
      timeCommitment: "1-2 hours per month",
    })
    onClose()
  }

  if (!mentor) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Mentorship</DialogTitle>
          <DialogDescription>Send a personalized request to connect with your chosen mentor</DialogDescription>
        </DialogHeader>

        {/* Mentor Info */}
        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg mb-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {mentor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
            <p className="text-sm text-gray-600 mb-1">
              {mentor.title} at {mentor.company}
            </p>
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {mentor.location} • Class of {mentor.graduationYear}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {mentor.rating} ({mentor.reviewCount} reviews)
                </span>
              </div>
              <div className="text-sm text-gray-600">{mentor.menteeCount} mentees</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief subject line for your request"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Personal Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Introduce yourself and explain why you'd like this person as your mentor..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Your Goals</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              placeholder="What specific goals do you hope to achieve through this mentorship?"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeCommitment">Expected Time Commitment</Label>
            <select
              id="timeCommitment"
              value={formData.timeCommitment}
              onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1-2 hours per month">1-2 hours per month</option>
              <option value="2-4 hours per month">2-4 hours per month</option>
              <option value="4-6 hours per month">4-6 hours per month</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Send Request
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
