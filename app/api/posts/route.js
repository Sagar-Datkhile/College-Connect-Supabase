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

// GET - Fetch blog posts with optional filtering
export async function GET(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get("authorId")
    const category = searchParams.get("category")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "published"
    const page = parseInt(searchParams.get("page") || "1")
    
    // Create cache key based on query parameters
    const cacheKey = `posts_${status}_${authorId || 'all'}_${category || 'all'}_${page}_${limit}`
    
    // Check cache first
    const cachedPosts = getCachedResponse(cacheKey)
    if (cachedPosts) {
      return NextResponse.json(cachedPosts)
    }

    let postsRef = adminDb.collection("posts")
    
    // Apply filters
    if (status) {
      postsRef = postsRef.where("status", "==", status)
    }
    if (authorId) {
      postsRef = postsRef.where("authorId", "==", authorId)
    }
    if (category) {
      postsRef = postsRef.where("category", "==", category)
    }
    
    // Add pagination
    const offset = (page - 1) * limit
    postsRef = postsRef.orderBy("createdAt", "desc").limit(limit).offset(offset)

    const postsSnapshot = await postsRef.get()
    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString() || null,
    }))

    // Get total count for pagination
    const totalQuery = await adminDb.collection("posts")
      .where("status", "==", status)
      .get()
    const totalCount = totalQuery.size

    const result = {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      }
    }

    // Cache for 5 minutes
    cacheResponse(cacheKey, result, 300000)
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new blog post
export async function POST(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const { 
      title, 
      content, 
      excerpt, 
      category, 
      tags, 
      featuredImage, 
      status = "draft",
      slug
    } = await request.json()

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" }, 
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const postSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    // Check if slug already exists
    const existingPost = await adminDb.collection("posts")
      .where("slug", "==", postSlug)
      .get()
    
    if (!existingPost.empty) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      )
    }

    const newPostRef = adminDb.collection("posts").doc()
    const postData = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      category: category || "general",
      tags: tags || [],
      featuredImage: featuredImage || null,
      slug: postSlug,
      status,
      authorId: decodedToken.uid,
      authorEmail: decodedToken.email,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Add publishedAt if status is published
    if (status === "published") {
      postData.publishedAt = new Date()
    }

    await newPostRef.set(postData)

    return NextResponse.json({ 
      id: newPostRef.id, 
      slug: postSlug,
      message: "Post created successfully" 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update a blog post
export async function PUT(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Please check your environment variables." },
        { status: 500 }
      )
    }
    
    const decodedToken = await verifyToken(request)
    const { 
      id, 
      title, 
      content, 
      excerpt, 
      category, 
      tags, 
      featuredImage, 
      status,
      slug 
    } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const postRef = adminDb.collection("posts").doc(id)
    const postDoc = await postRef.get()

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Authorization check
    const postData = postDoc.data()
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (postData.authorId !== decodedToken.uid && (!userData || userData.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized to update this post" }, { status: 403 })
    }

    const updates = {
      updatedAt: new Date(),
    }

    if (title) updates.title = title
    if (content) updates.content = content
    if (excerpt) updates.excerpt = excerpt
    if (category) updates.category = category
    if (tags) updates.tags = tags
    if (featuredImage !== undefined) updates.featuredImage = featuredImage
    if (slug) updates.slug = slug
    
    // Handle status changes
    if (status && status !== postData.status) {
      updates.status = status
      if (status === "published" && !postData.publishedAt) {
        updates.publishedAt = new Date()
      }
    }

    await postRef.update(updates)

    return NextResponse.json({ message: "Post updated successfully" })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a blog post
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
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const postRef = adminDb.collection("posts").doc(id)
    const postDoc = await postRef.get()

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Authorization check
    const postData = postDoc.data()
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (postData.authorId !== decodedToken.uid && (!userData || userData.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized to delete this post" }, { status: 403 })
    }

    await postRef.delete()

    // Also delete associated comments
    const commentsQuery = await adminDb.collection("comments")
      .where("postId", "==", id)
      .get()
    
    const batch = adminDb.batch()
    commentsQuery.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
