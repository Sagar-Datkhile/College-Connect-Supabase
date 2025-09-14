"use client"

import { useState } from "react"
import { RoomList } from "./room-list"
import { ChatRoom } from "./chat-room"
import { CreateRoomModal } from "./create-room-modal"

export function DiscussionDashboard({ user }) {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleSelectRoom = (room) => {
    setSelectedRoom(room)
  }

  const handleBackToRooms = () => {
    setSelectedRoom(null)
  }

  const handleCreateRoom = () => {
    setIsCreateModalOpen(true)
  }

  const handleSubmitRoom = (roomData) => {
    // In a real app, this would create the room in the backend
    console.log("Creating room:", roomData)
    // Show success message or update UI
  }

  if (selectedRoom) {
    return (
      <div className="h-full">
        <ChatRoom room={selectedRoom} user={user} onBack={handleBackToRooms} />
      </div>
    )
  }

  return (
    <div>
      <RoomList onSelectRoom={handleSelectRoom} onCreateRoom={handleCreateRoom} />
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitRoom}
      />
    </div>
  )
}
