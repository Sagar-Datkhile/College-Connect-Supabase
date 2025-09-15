import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

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

// GET - Fetch mentorship requests (can be filtered by mentorId or menteeId)
export async function GET(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const { searchParams } = new URL(request.url)
    const mentorId = searchParams.get("mentorId")
    const menteeId = searchParams.get("menteeId")

    let mentorshipRef = adminDb.collection("mentorshipRequests")

    if (mentorId) {
      mentorshipRef = mentorshipRef.where("mentorId", "==", mentorId)
    }
    if (menteeId) {
      mentorshipRef = mentorshipRef.where("menteeId", "==", menteeId)
    }

    const mentorshipSnapshot = await mentorshipRef.orderBy("createdAt", "desc").get()
    const mentorshipRequests = mentorshipSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({ mentorshipRequests })
  } catch (error) {
    console.error("Error fetching mentorship requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new mentorship request
export async function POST(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const { mentorId, message } = await request.json()

    if (!mentorId || !message) {
      return NextResponse.json({ error: "Mentor ID and message are required" }, { status: 400 })
    }

    const newRequestRef = adminDb.collection("mentorshipRequests").doc()
    await newRequestRef.set({
      mentorId,
      menteeId: decodedToken.uid,
      menteeEmail: decodedToken.email,
      message,
      status: "pending", // pending, accepted, rejected, cancelled
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: newRequestRef.id, message: "Mentorship request sent successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating mentorship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update a mentorship request (e.g., accept/reject by mentor, cancel by mentee)
export async function PUT(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Request ID and status are required" }, { status: 400 })
    }

    const requestRef = adminDb.collection("mentorshipRequests").doc(id)
    const requestDoc = await requestRef.get()

    if (!requestDoc.exists) {
      return NextResponse.json({ error: "Mentorship request not found" }, { status: 404 })
    }

    const requestData = requestDoc.data()

    // Authorization logic:
    // Mentor can accept/reject
    // Mentee can cancel
    // Admin can do anything
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    const isMentor = requestData.mentorId === decodedToken.uid
    const isMentee = requestData.menteeId === decodedToken.uid
    const isAdmin = userData && userData.role === "admin"

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

    await requestRef.update({
      status,
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: "Mentorship request updated successfully" })
  } catch (error) {
    console.error("Error updating mentorship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a mentorship request (only by mentee or admin)
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
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    const requestRef = adminDb.collection("mentorshipRequests").doc(id)
    const requestDoc = await requestRef.get()

    if (!requestDoc.exists) {
      return NextResponse.json({ error: "Mentorship request not found" }, { status: 404 })
    }

    const requestData = requestDoc.data()

    // Only the mentee who created the request or an admin can delete it
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (requestData.menteeId !== decodedToken.uid && (!userData || userData.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized to delete this request" }, { status: 403 })
    }

    await requestRef.delete()

    return NextResponse.json({ message: "Mentorship request deleted successfully" })
  } catch (error) {
    console.error("Error deleting mentorship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}