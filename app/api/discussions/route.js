import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

// Verify Firebase ID token
async function verifyToken(request) {
  try {
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

// GET - Fetch discussion rooms
export async function GET(request) {
  try {
    const decodedToken = await verifyToken(request)

    const snapshot = await adminDb.collection("discussionRooms").orderBy("lastActivity", "desc").get()

    const rooms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      lastActivity: doc.data().lastActivity?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({ rooms })
  } catch (error) {
    console.error("Error fetching discussion rooms:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create discussion room
export async function POST(request) {
  try {
    const decodedToken = await verifyToken(request)
    const roomData = await request.json()

    // Create discussion room
    const docRef = await adminDb.collection("discussionRooms").add({
      ...roomData,
      createdBy: decodedToken.uid,
      memberCount: 1,
      members: [decodedToken.uid],
      lastActivity: new Date(),
      createdAt: new Date(),
    })

    return NextResponse.json({ id: docRef.id, success: true })
  } catch (error) {
    console.error("Error creating discussion room:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
