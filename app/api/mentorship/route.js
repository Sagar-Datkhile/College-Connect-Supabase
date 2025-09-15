import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

// Helper function to verify Supabase JWT
async function verifyToken(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided")
    }

    const token = authHeader.split("Bearer ")[1]
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) throw new Error("Invalid token")
    return data.user
  } catch (error) {
    throw new Error("Invalid token")
  }
}

// GET - Fetch mentorship requests (can be filtered by mentorId or menteeId)
export async function GET(request) {
  try {
    const user = await verifyToken(request)
    const { searchParams } = new URL(request.url)
    const mentorId = searchParams.get("mentorId")
    const menteeId = searchParams.get("menteeId")

    let query = supabase.from("mentorship_requests").select("*").order("created_at", { ascending: false })
    if (mentorId) query = query.eq("mentor_id", mentorId)
    if (menteeId) query = query.eq("mentee_id", menteeId)
    const { data: mentorshipRequests, error } = await query
    if (error) throw error

    return NextResponse.json({ mentorshipRequests })
  } catch (error) {
    console.error("Error fetching mentorship requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new mentorship request
export async function POST(request) {
  try {
    const user = await verifyToken(request)
    const { mentorId, message } = await request.json()

    if (!mentorId || !message) {
      return NextResponse.json({ error: "Mentor ID and message are required" }, { status: 400 })
    }

    const payload = {
      mentor_id: mentorId,
      mentee_id: user.id,
      mentee_email: user.email,
      message,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase.from("mentorship_requests").insert(payload).select("id").single()
    if (error) throw error

    return NextResponse.json({ id: data.id, message: "Mentorship request sent successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating mentorship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update a mentorship request (e.g., accept/reject by mentor, cancel by mentee)
export async function PUT(request) {
  try {
    const user = await verifyToken(request)
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Request ID and status are required" }, { status: 400 })
    }

    const { data: requestData, error: findError } = await supabase
      .from("mentorship_requests")
      .select("*")
      .eq("id", id)
      .single()
    if (findError) {
      if (findError.code === 'PGRST116') return NextResponse.json({ error: "Mentorship request not found" }, { status: 404 })
      throw findError
    }

    // Authorization logic:
    // Mentor can accept/reject
    // Mentee can cancel
    // Admin can do anything
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profileError) throw profileError

    const isMentor = requestData.mentor_id === user.id
    const isMentee = requestData.mentee_id === user.id
    const isAdmin = profile && profile.role === "admin"

    if (status === "accepted" || status === "rejected") {
      if (!isMentor && !isAdmin) {
        return NextResponse.json({ error: "Unauthorized to update this request status" }, { status: 403 })
      }
    } else if (status === "cancelled") {
      if (!isMentee && !isAdmin) {
        return NextResponse.json({ error: "Unauthorized to cancel this request" }, { status: 403 })
      }
    } else {
      return NextResponse.json({ error: "Invalid status update" }, { status: 400 })
    }

    const { error } = await supabase
      .from("mentorship_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (error) throw error

    return NextResponse.json({ message: "Mentorship request updated successfully" })
  } catch (error) {
    console.error("Error updating mentorship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a mentorship request (only by mentee or admin)
export async function DELETE(request) {
  try {
    const user = await verifyToken(request)
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    const { data: requestData, error: findError } = await supabase
      .from("mentorship_requests")
      .select("*")
      .eq("id", id)
      .single()
    if (findError) {
      if (findError.code === 'PGRST116') return NextResponse.json({ error: "Mentorship request not found" }, { status: 404 })
      throw findError
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profileError) throw profileError

    if (requestData.mentee_id !== user.id && (!profile || profile.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized to delete this request" }, { status: 403 })
    }

    const { error } = await supabase.from("mentorship_requests").delete().eq("id", id)
    if (error) throw error

    return NextResponse.json({ message: "Mentorship request deleted successfully" })
  } catch (error) {
    console.error("Error deleting mentorship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}