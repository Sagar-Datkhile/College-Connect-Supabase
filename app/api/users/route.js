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

// GET - Fetch users (admin only)
export async function GET(request) {
  try {
    const decodedToken = await verifyToken(request)

    // Check if user is admin
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (!userData || (userData.role !== "admin" && !decodedToken.email?.includes("admin"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Fetch all users
    const usersSnapshot = await adminDb.collection("users").orderBy("createdAt", "desc").get()
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update user (admin only)
export async function PUT(request) {
  try {
    const decodedToken = await verifyToken(request)
    const { userId, updates } = await request.json()

    // Check if user is admin
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (!userData || (userData.role !== "admin" && !decodedToken.email?.includes("admin"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update user document
    await adminDb
      .collection("users")
      .doc(userId)
      .update({
        ...updates,
        updatedAt: new Date(),
      })

    // If updating verification status, also update Firebase Auth
    if (updates.verified !== undefined) {
      await adminAuth.updateUser(userId, {
        emailVerified: updates.verified,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete user (admin only)
export async function DELETE(request) {
  try {
    const decodedToken = await verifyToken(request)
    const { userId } = await request.json()

    // Check if user is admin
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (!userData || (userData.role !== "admin" && !decodedToken.email?.includes("admin"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete user from Firebase Auth
    await adminAuth.deleteUser(userId)

    // Delete user document from Firestore
    await adminDb.collection("users").doc(userId).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
