import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { getCachedResponse, cacheResponse } from "@/lib/cache"

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

// GET - Fetch all discussion rooms
export async function GET(request) {
  try {
    const user = await verifyToken(request)
    const cacheKey = `discussions_${user.id}`
    
    // Check cache first
    const cachedDiscussions = getCachedResponse(cacheKey)
    if (cachedDiscussions) {
      return NextResponse.json({ discussions: cachedDiscussions })
    }

    const { data: discussions, error } = await supabase
      .from("discussions")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) throw error

    // Cache for 2 minutes
    cacheResponse(cacheKey, discussions, 120000)
    
    const response = NextResponse.json({ discussions })
    response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300')
    return response
  } catch (error) {
    console.error("Error fetching discussions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new discussion room
export async function POST(request) {
  try {
    const user = await verifyToken(request)
    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const payload = {
      title,
      description,
      creator_id: user.id,
      creator_email: user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase.from("discussions").insert(payload).select("id").single()
    if (error) throw error

    return NextResponse.json({ id: data.id, message: "Discussion created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating discussion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update a discussion room
export async function PUT(request) {
  try {
    const user = await verifyToken(request)
    const { id, title, description } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Discussion ID is required" }, { status: 400 })
    }

    const { data: discussionData, error: findError } = await supabase
      .from("discussions")
      .select("*")
      .eq("id", id)
      .single()
    if (findError) {
      if (findError.code === 'PGRST116') return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
      throw findError
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profileError) throw profileError

    if (discussionData.creator_id !== user.id && (!profile || profile.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized to update this discussion" }, { status: 403 })
    }

    const updates = {}
    if (title) updates.title = title
    if (description) updates.description = description
    updates.updated_at = new Date().toISOString()

    const { error } = await supabase.from("discussions").update(updates).eq("id", id)
    if (error) throw error

    return NextResponse.json({ message: "Discussion updated successfully" })
  } catch (error) {
    console.error("Error updating discussion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a discussion room
export async function DELETE(request) {
  try {
    const user = await verifyToken(request)
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Discussion ID is required" }, { status: 400 })
    }

    const { data: discussionData, error: findError } = await supabase
      .from("discussions")
      .select("*")
      .eq("id", id)
      .single()
    if (findError) {
      if (findError.code === 'PGRST116') return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
      throw findError
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profileError) throw profileError

    if (discussionData.creator_id !== user.id && (!profile || profile.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized to delete this discussion" }, { status: 403 })
    }

    const { error } = await supabase.from("discussions").delete().eq("id", id)
    if (error) throw error

    return NextResponse.json({ message: "Discussion deleted successfully" })
  } catch (error) {
    console.error("Error deleting discussion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}