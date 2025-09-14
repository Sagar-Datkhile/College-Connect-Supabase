"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Users, Settings, Send, Smile, Paperclip } from "lucide-react"

export function ChatRoom({ room, user, onBack }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "Sarah Chen",
      content: "Anyone working on the binary tree assignment? I'm stuck on the traversal part.",
      timestamp: "2024-03-10 14:30",
      isOwn: false,
      reactions: [
        { emoji: "👍", count: 3, users: ["Mike", "Emily", "David"] },
        { emoji: "❤️", count: 1, users: ["Alex"] },
      ],
    },
    {
      id: 2,
      author: "Mike Johnson",
      content:
        "I can help! The key is understanding the recursive structure. Are you doing in-order, pre-order, or post-order?",
      timestamp: "2024-03-10 14:32",
      isOwn: false,
      reactions: [{ emoji: "🙏", count: 2, users: ["Sarah", "Emily"] }],
    },
    {
      id: 3,
      author: "John Doe",
      content: "Thanks Mike! I'm working on in-order traversal. The recursive calls are confusing me.",
      timestamp: "2024-03-10 14:35",
      isOwn: true,
      reactions: [],
    },
    {
      id: 4,
      author: "Emily Rodriguez",
      content:
        "I found this visualization really helpful: https://visualgo.net/en/bst. It shows how the traversal works step by step.",
      timestamp: "2024-03-10 14:37",
      isOwn: false,
      reactions: [
        { emoji: "🔥", count: 4, users: ["Sarah", "Mike", "John", "David"] },
        { emoji: "👏", count: 2, users: ["Alex", "Lisa"] },
      ],
    },
  ])

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        author: user.name,
        content: message,
        timestamp: new Date().toLocaleString(),
        isOwn: true,
        reactions: [],
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const handleReaction = (messageId, emoji) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji)
          if (existingReaction) {
            if (existingReaction.users.includes(user.name)) {
              // Remove reaction
              return {
                ...msg,
                reactions: msg.reactions
                  .map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count - 1,
                          users: r.users.filter((u) => u !== user.name),
                        }
                      : r,
                  )
                  .filter((r) => r.count > 0),
              }
            } else {
              // Add reaction
              return {
                ...msg,
                reactions: msg.reactions.map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.count + 1,
                        users: [...r.users, user.name],
                      }
                    : r,
                ),
              }
            }
          } else {
            // New reaction
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, users: [user.name] }],
            }
          }
        }
        return msg
      }),
    )
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-lg">{room.name}</CardTitle>
                <p className="text-sm text-gray-600">{room.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <Users className="h-3 w-3 mr-1" />
                {room.memberCount} online
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto max-h-96">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex space-x-3 max-w-xs lg:max-w-md ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {msg.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${msg.isOwn ? "items-end" : "items-start"}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">{msg.author}</span>
                      <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${msg.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    {msg.reactions.length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {msg.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            onClick={() => handleReaction(msg.id, reaction.emoji)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${
                              reaction.users.includes(user.name)
                                ? "bg-blue-100 border-blue-300"
                                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-1 mt-1">
                      {["👍", "❤️", "😂", "🔥"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="text-xs hover:bg-gray-200 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Button type="button" variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button type="submit" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
