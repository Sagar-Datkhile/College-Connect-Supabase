import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"
import { getCachedResponse, cacheResponse } from "@/lib/cache"

// Helper function to verify Firebase ID token
async function verifyToken(request) {
  try {
    if (!adminAuth) {
      throw new Error("Firebase Admin not properly configured")
    }
    
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided")
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    throw new Error("Invalid token")
  }
}

// GET - Fetch all discussion rooms
export async function GET(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const cacheKey = `discussions_${decodedToken.uid}`
    
    // Check cache first
    const cachedDiscussions = getCachedResponse(cacheKey)
    if (cachedDiscussions) {
      return NextResponse.json({ discussions: cachedDiscussions })
    }

    const discussionsSnapshot = await adminDb.collection("discussions").orderBy("createdAt", "desc").get()
    const discussions = discussionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }))

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
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const newDiscussionRef = adminDb.collection("discussions").doc()
    await newDiscussionRef.set({
      title,
      description,
      creatorId: decodedToken.uid,
      creatorEmail: decodedToken.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: newDiscussionRef.id, message: "Discussion created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating discussion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update a discussion room
export async function PUT(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const { id, title, description } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Discussion ID is required" }, { status: 400 })
    }

    const discussionRef = adminDb.collection("discussions").doc(id)
    const discussionDoc = await discussionRef.get()

    if (!discussionDoc.exists) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
    }

    // Only the creator or an admin can update a discussion
    const discussionData = discussionDoc.data()
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (discussionData.creatorId !== decodedToken.uid && (!userData || userData.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized to update this discussion" }, { status: 403 })
    }

    const updates = {}
    if (title) updates.title = title
    if (description) updates.description = description
    updates.updatedAt = new Date()

    await discussionRef.update(updates)

    return NextResponse.json({ message: "Discussion updated successfully" })
  } catch (error) {
    console.error("Error updating discussion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a discussion room
export async function DELETE(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Discussion ID is required" }, { status: 400 })
    }

    const discussionRef = adminDb.collection("discussions").doc(id)
    const discussionDoc = await discussionRef.get()

    if (!discussionDoc.exists) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
    }

    // Only the creator or an admin can delete a discussion
    const discussionData = discussionDoc.data()
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (discussionData.creatorId !== decodedToken.uid && (!userData || userData.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized to delete this discussion" }, { status: 403 })
    }

    await discussionRef.delete()

    return NextResponse.json({ message: "Discussion deleted successfully" })
  } catch (error) {
    console.error("Error deleting discussion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}