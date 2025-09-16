"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  Calendar, 
  User, 
  Send, 
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function PostPage({ params }) {
  const { slug } = params
  const { user, getIdToken } = useAuth()
  const router = useRouter()
  
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentContent, setCommentContent] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      
      const headers = {}
      if (user) {
        const token = await getIdToken()
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`/api/posts/${slug}`, { headers })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch post")
      }

      setPost(data.post)
      setLiked(data.post.isLiked || false)
      setLikeCount(data.post.likeCount || 0)
    } catch (error) {
      console.error("Error fetching post:", error)
      toast.error("Failed to load post")
      router.push("/posts")
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      setCommentsLoading(true)
      const response = await fetch(`/api/posts/${slug}/interactions?limit=20`)
      const data = await response.json()

      if (response.ok) {
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts")
      return
    }

    try {
      const token = await getIdToken()
      const action = liked ? "unlike" : "like"
      
      const response = await fetch(`/api/posts/${slug}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error("Failed to update like")
      }

      setLiked(!liked)
      setLikeCount(prev => liked ? prev - 1 : prev + 1)
      toast.success(liked ? "Post unliked" : "Post liked!")
    } catch (error) {
      console.error("Error updating like:", error)
      toast.error("Failed to update like")
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Please login to comment")
      return
    }

    if (!commentContent.trim()) {
      toast.error("Please enter a comment")
      return
    }

    try {
      setSubmittingComment(true)
      const token = await getIdToken()
      
      const response = await fetch(`/api/posts/${slug}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          action: "comment",
          content: commentContent 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add comment")
      }

      setComments(prev => [data.comment, ...prev])
      setCommentContent("")
      toast.success("Comment added successfully!")
      
      // Update post comment count
      setPost(prev => ({
        ...prev,
        commentCount: (prev.commentCount || 0) + 1
      }))
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error(error.message || "Failed to add comment")
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleShare = async (platform) => {
    const url = `${window.location.origin}/posts/${slug}`
    const title = post?.title || "Check out this post"
    
    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(url)
          toast.success("Link copied to clipboard!")
        } catch (error) {
          toast.error("Failed to copy link")
        }
        break
      
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
        break
      
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this post: ${url}`)}`)
        break
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canEditPost = user && post && (user.uid === post.authorId)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <Link href="/posts">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/posts">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Post Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{post.category}</Badge>
                      {post.status === "draft" && (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {post.title}
                    </h1>
                  </div>
                  
                  {canEditPost && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/posts/${slug}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Post
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Author and Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.author?.avatar} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {post.author?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.viewCount || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Featured Image */}
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
                  />
                )}

                {/* Post Content */}
                <div className="prose prose-lg max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {post.content}
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-8" />

                {/* Engagement Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={liked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center gap-2"
                    >
                      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                      <span>{likeCount}</span>
                    </Button>
                    
                    <div className="flex items-center gap-2 text-gray-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{comments.length} comments</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShare('copy')}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('twitter')}>
                        <Twitter className="h-4 w-4 mr-2" />
                        Share on Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('facebook')}>
                        <Facebook className="h-4 w-4 mr-2" />
                        Share on Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                        <Linkedin className="h-4 w-4 mr-2" />
                        Share on LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('email')}>
                        <Mail className="h-4 w-4 mr-2" />
                        Share via Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Comment Form */}
                {user ? (
                  <form onSubmit={handleComment} className="mb-6">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          placeholder="Write a comment..."
                          rows={3}
                          className="mb-2"
                        />
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            size="sm"
                            disabled={submittingComment || !commentContent.trim()}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {submittingComment ? "Posting..." : "Post Comment"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg mb-6">
                    <p className="text-gray-600 mb-3">Please login to leave a comment</p>
                    <Link href="/login">
                      <Button size="sm">Login</Button>
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                {commentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex gap-3 animate-pulse">
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No comments yet. Be the first to share your thoughts!
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={comment.authorAvatar} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {comment.authorName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            {post.author && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {post.author.name}
                    </h4>
                    {post.author.bio && (
                      <p className="text-sm text-gray-600">
                        {post.author.bio}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Related Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  More posts coming soon...
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
