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

// GET - Fetch mentorship requests
export async function GET(request) {
  try {
    const decodedToken = await verifyToken(request)
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"

    let query = adminDb.collection("mentorshipRequests")

    if (type === "sent") {
      query = query.where("studentId", "==", decodedToken.uid)
    } else if (type === "received") {
      query = query.where("mentorId", "==", decodedToken.uid)
    } else {
      // Get both sent and received
      query = query.where("studentId", "==", decodedToken.uid)
    }

    const snapshot = await query.orderBy("createdAt", "desc").get()
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Error fetching mentorship requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create mentorship request
export async function POST(request) {
  try {
    const decodedToken = await verifyToken(request)
    const requestData = await request.json()

    // Create mentorship request
    const docRef = await adminDb.collection("mentorshipRequests").add({
      ...requestData,
      studentId: decodedToken.uid,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: docRef.id, success: true })
  } catch (error) {
    console.error("Error creating mentorship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update mentorship request
export async function PUT(request) {
  try {
    const decodedToken = await verifyToken(request)
    const { requestId, updates } = await request.json()

    // Verify user can update this request
    const requestDoc = await adminDb.collection("mentorshipRequests").doc(requestId).get()
    const requestData = requestDoc.data()

    if (!requestData || (requestData.studentId !== decodedToken.uid && requestData.mentorId !== decodedToken.uid)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update request
    await adminDb
      .collection("mentorshipRequests")
      .doc(requestId)
      .update({
        ...updates,
        updatedAt: new Date(),
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating mentorship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
