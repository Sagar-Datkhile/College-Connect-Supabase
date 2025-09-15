import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

// Verify Supabase JWT from Authorization header
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

// GET - Fetch users (admin only)
export async function GET(request) {
  try {
    const user = await verifyToken(request)

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profileError) throw profileError

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Fetch all users
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) throw error

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update user (admin only)
export async function PUT(request) {
  try {
    const user = await verifyToken(request)
    const { userId, updates } = await request.json()

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profileError) throw profileError

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete user (admin only)
export async function DELETE(request) {
  try {
    const user = await verifyToken(request)
    const { userId } = await request.json()

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profileError) throw profileError

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { error: deleteError } = await supabase.from("users").delete().eq("id", userId)
    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
