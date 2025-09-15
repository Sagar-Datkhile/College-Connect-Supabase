import supabase, { isSupabaseConfigured } from "./supabase"

// Users collection operations
export const createUser = async (userData) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return "mock-id-" + Date.now()
  }

  try {
    const payload = {
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase.from("users").insert(payload).select("id").single()
    if (error) throw error
    return data?.id
  } catch (error) {
    console.error("Error creating user:
", error)
    throw error
  }
}

export const getUser = async (userId) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return null
  }

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}

export const updateUser = async (userId, updates) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return
  }

  try {
    const payload = { ...updates, updated_at: new Date().toISOString() }
    const { error } = await supabase.from("users").update(payload).eq("id", userId)
    if (error) throw error
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

// Mentorship requests operations
export const createMentorshipRequest = async (requestData) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return "mock-request-" + Date.now()
  }

  try {
    const payload = {
      ...requestData,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase.from("mentorship_requests").insert(payload).select("id").single()
    if (error) throw error
    return data?.id
  } catch (error) {
    console.error("Error creating mentorship request:", error)
    throw error
  }
}

export const getMentorshipRequests = async (userId, type = "all") => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return []
  }

  try {
    let query = supabase.from("mentorship_requests").select("*").order("created_at", { ascending: false })
    if (type === "sent") {
      query = query.eq("student_id", userId)
    } else if (type === "received") {
      query = query.eq("mentor_id", userId)
    } else {
      query = query.eq("student_id", userId)
    }
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting mentorship requests:", error)
    throw error
  }
}

export const updateMentorshipRequest = async (requestId, updates) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return
  }

  try {
    const payload = { ...updates, updated_at: new Date().toISOString() }
    const { error } = await supabase.from("mentorship_requests").update(payload).eq("id", requestId)
    if (error) throw error
  } catch (error) {
    console.error("Error updating mentorship request:", error)
    throw error
  }
}

// Discussion rooms operations
export const createDiscussionRoom = async (roomData) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return "mock-room-" + Date.now()
  }

  try {
    const payload = {
      ...roomData,
      member_count: 1,
      last_activity: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase.from("discussion_rooms").insert(payload).select("id").single()
    if (error) throw error
    return data?.id
  } catch (error) {
    console.error("Error creating discussion room:", error)
    throw error
  }
}

export const getDiscussionRooms = async () => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return []
  }

  try {
    const { data, error } = await supabase
      .from("discussion_rooms")
      .select("*")
      .order("last_activity", { ascending: false })
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting discussion rooms:", error)
    throw error
  }
}

export const addMessage = async (roomId, messageData) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return "mock-message-" + Date.now()
  }

  try {
    const payload = {
      ...messageData,
      room_id: roomId,
      created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase.from("messages").insert(payload).select("id").single()
    if (error) throw error

    const { error: roomUpdateError } = await supabase
      .from("discussion_rooms")
      .update({ last_activity: new Date().toISOString(), last_message: messageData.content })
      .eq("id", roomId)
    if (roomUpdateError) throw roomUpdateError

    return data?.id
  } catch (error) {
    console.error("Error adding message:", error)
    throw error
  }
}

export const getMessages = async (roomId) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return []
  }

  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting messages:", error)
    throw error
  }
}

// Real-time listeners
export const subscribeToMessages = (roomId, callback) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return () => {}
  }

  try {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          // Re-fetch minimal to keep behaviour similar
          getMessages(roomId).then(callback).catch(() => {})
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  } catch (error) {
    console.error("Error subscribing to messages:", error)
    return () => {}
  }
}

export const subscribeToDiscussionRooms = (callback) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not available - using mock data")
    return () => {}
  }

  try {
    const channel = supabase
      .channel('discussion_rooms')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'discussion_rooms' },
        () => {
          getDiscussionRooms().then(callback).catch(() => {})
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  } catch (error) {
    console.error("Error subscribing to discussion rooms:", error)
    return () => {}
  }
}
