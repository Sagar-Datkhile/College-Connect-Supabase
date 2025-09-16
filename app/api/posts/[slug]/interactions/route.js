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

// POST - Handle post interactions (like, unlike, comment)
export async function POST(request, { params }) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const { slug } = params
    const { action, content } = await request.json()

    // Find the post by slug
    const postsQuery = await adminDb.collection("posts")
      .where("slug", "==", slug)
      .limit(1)
      .get()

    if (postsQuery.empty) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const postDoc = postsQuery.docs[0]
    const postId = postDoc.id
    const postData = postDoc.data()

    if (postData.status !== "published") {
      return NextResponse.json({ error: "Cannot interact with unpublished post" }, { status: 400 })
    }

    switch (action) {
      case "like":
        return await handleLike(postId, decodedToken.uid, postDoc.ref)
      
      case "unlike":
        return await handleUnlike(postId, decodedToken.uid, postDoc.ref)
      
      case "comment":
        if (!content || content.trim() === "") {
          return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
        }
        return await handleComment(postId, decodedToken, content, postDoc.ref)
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error handling post interaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleLike(postId, userId, postRef) {
  try {
    // Check if user already liked this post
    const existingLike = await adminDb.collection("postLikes")
      .where("postId", "==", postId)
      .where("userId", "==", userId)
      .get()

    if (!existingLike.empty) {
      return NextResponse.json({ message: "Post already liked" }, { status: 200 })
    }

    // Add like document
    await adminDb.collection("postLikes").add({
      postId,
      userId,
      createdAt: new Date(),
    })

    // Increment like count in post
    const postSnapshot = await postRef.get()
    const currentLikeCount = postSnapshot.data().likeCount || 0
    await postRef.update({
      likeCount: currentLikeCount + 1
    })

    return NextResponse.json({ message: "Post liked successfully" }, { status: 200 })
  } catch (error) {
    throw error
  }
}

async function handleUnlike(postId, userId, postRef) {
  try {
    // Find and delete the like document
    const likeQuery = await adminDb.collection("postLikes")
      .where("postId", "==", postId)
      .where("userId", "==", userId)
      .get()

    if (likeQuery.empty) {
      return NextResponse.json({ message: "Post not liked" }, { status: 200 })
    }

    // Delete the like document
    await likeQuery.docs[0].ref.delete()

    // Decrement like count in post
    const postSnapshot = await postRef.get()
    const currentLikeCount = postSnapshot.data().likeCount || 0
    await postRef.update({
      likeCount: Math.max(0, currentLikeCount - 1)
    })

    return NextResponse.json({ message: "Post unliked successfully" }, { status: 200 })
  } catch (error) {
    throw error
  }
}

async function handleComment(postId, decodedToken, content, postRef) {
  try {
    // Get user information
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    // Create comment document
    const newCommentRef = adminDb.collection("comments").doc()
    await newCommentRef.set({
      postId,
      authorId: decodedToken.uid,
      authorName: userData?.displayName || userData?.name || "Anonymous",
      authorEmail: decodedToken.email,
      authorAvatar: userData?.photoURL || null,
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Increment comment count in post
    const postSnapshot = await postRef.get()
    const currentCommentCount = postSnapshot.data().commentCount || 0
    await postRef.update({
      commentCount: currentCommentCount + 1
    })

    const comment = {
      id: newCommentRef.id,
      postId,
      authorId: decodedToken.uid,
      authorName: userData?.displayName || userData?.name || "Anonymous",
      authorEmail: decodedToken.email,
      authorAvatar: userData?.photoURL || null,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ 
      message: "Comment added successfully",
      comment 
    }, { status: 201 })
  } catch (error) {
    throw error
  }
}

// GET - Fetch post comments
export async function GET(request, { params }) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")

    // Find the post by slug
    const postsQuery = await adminDb.collection("posts")
      .where("slug", "==", slug)
      .limit(1)
      .get()

    if (postsQuery.empty) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const postId = postsQuery.docs[0].id

    // Get comments with pagination
    const offset = (page - 1) * limit
    const commentsQuery = await adminDb.collection("comments")
      .where("postId", "==", postId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset(offset)
      .get()

    const comments = commentsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }))

    // Get total count for pagination
    const totalQuery = await adminDb.collection("comments")
      .where("postId", "==", postId)
      .get()
    const totalCount = totalQuery.size

    const result = {
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
