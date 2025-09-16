import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

// Helper function to verify Firebase ID token (optional for GET requests)
async function verifyToken(request, required = false) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      if (required) {
        throw new Error("No token provided")
      }
      return null
    }

    if (!adminAuth) {
      throw new Error("Firebase Admin not properly configured")
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    if (required) {
      throw new Error("Invalid token")
    }
    return null
  }
}

// GET - Fetch a single blog post by slug
export async function GET(request, { params }) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }

    const { slug } = params
    const decodedToken = await verifyToken(request, false)

    // Find post by slug
    const postsQuery = await adminDb.collection("posts")
      .where("slug", "==", slug)
      .limit(1)
      .get()

    if (postsQuery.empty) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const postDoc = postsQuery.docs[0]
    const postData = postDoc.data()

    // Check if user can view this post
    if (postData.status !== "published") {
      // Only author or admin can view unpublished posts
      if (!decodedToken || 
          (postData.authorId !== decodedToken.uid && 
           (!await isAdmin(decodedToken.uid)))) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }
    }

    // Increment view count for published posts
    if (postData.status === "published") {
      await postDoc.ref.update({
        viewCount: (postData.viewCount || 0) + 1
      })
    }

    // Get author information
    const authorDoc = await adminDb.collection("users").doc(postData.authorId).get()
    const authorData = authorDoc.data()

    const post = {
      id: postDoc.id,
      ...postData,
      createdAt: postData.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: postData.updatedAt?.toDate?.()?.toISOString() || null,
      publishedAt: postData.publishedAt?.toDate?.()?.toISOString() || null,
      author: {
        id: postData.authorId,
        name: authorData?.displayName || authorData?.name || "Anonymous",
        email: authorData?.email || postData.authorEmail,
        avatar: authorData?.photoURL || null,
        bio: authorData?.bio || null,
      }
    }

    // Check if current user liked this post
    if (decodedToken) {
      const likeDoc = await adminDb.collection("postLikes")
        .where("postId", "==", postDoc.id)
        .where("userId", "==", decodedToken.uid)
        .get()
      post.isLiked = !likeDoc.empty
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to check if user is admin
async function isAdmin(userId) {
  try {
    const userDoc = await adminDb.collection("users").doc(userId).get()
    const userData = userDoc.data()
    return userData?.role === "admin"
  } catch (error) {
    return false
  }
}
