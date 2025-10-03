"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X, Eye, Save, Send, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function EditPostPage({ params }) {
  const { slug } = params
  const { user, getIdToken } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [postId, setPostId] = useState(null)
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "general",
    tags: [],
    featuredImage: "",
    status: "draft",
    slug: ""
  })

  const [tagInput, setTagInput] = useState("")

  const categories = [
    "general",
    "technology", 
    "academics",
    "career",
    "lifestyle",
    "events",
    "tips",
    "experiences"
  ]

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchPost()
  }, [user, slug, router])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const token = await getIdToken()
      
      const response = await fetch(`/api/posts/${slug}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch post")
      }

      const post = data.post

      // Check if user can edit this post
      if (post.authorId !== user.uid) {
        toast.error("You don't have permission to edit this post")
        router.push(`/posts/${slug}`)
        return
      }

      setPostId(post.id)
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        category: post.category,
        tags: post.tags || [],
        featuredImage: post.featuredImage || "",
        status: post.status,
        slug: post.slug
      })
    } catch (error) {
      console.error("Error fetching post:", error)
      toast.error("Failed to load post")
      router.push("/posts")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (publishStatus) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required")
      return
    }

    setUpdating(true)
    try {
      const token = await getIdToken()
      const updateData = {
        id: postId,
        ...formData,
        status: publishStatus,
        excerpt: formData.excerpt || formData.content.substring(0, 200) + "..."
      }

      const response = await fetch("/api/posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update post")
      }

      toast.success(`Post ${publishStatus === 'published' ? 'published' : 'updated'} successfully!`)
      router.push(`/posts/${formData.slug}`)
    } catch (error) {
      console.error("Error updating post:", error)
      toast.error(error.message || "Failed to update post")
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    try {
      setUpdating(true)
      const token = await getIdToken()
      
      const response = await fetch("/api/posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: postId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete post")
      }

      toast.success("Post deleted successfully!")
      router.push("/posts")
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error(error.message || "Failed to delete post")
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link href={`/posts/${slug}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Post
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Post
          </h1>
          <p className="text-gray-600">
            Update your post content and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Post Content</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode ? "Edit" : "Preview"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {!previewMode ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Enter your post title..."
                        className="text-lg font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL)
                      </label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => handleInputChange("slug", e.target.value)}
                        placeholder="post-url-slug"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This will be the URL: /posts/{formData.slug}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                      </label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => handleInputChange("content", e.target.value)}
                        placeholder="Write your post content here... (You can use Markdown formatting)"
                        rows={15}
                        className="font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supports Markdown formatting
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt (Optional)
                      </label>
                      <Textarea
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange("excerpt", e.target.value)}
                        placeholder="Brief description of your post..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image URL (Optional)
                      </label>
                      <Input
                        value={formData.featuredImage}
                        onChange={(e) => handleInputChange("featuredImage", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        type="url"
                      />
                    </div>
                  </>
                ) : (
                  /* Preview Mode */
                  <div className="prose prose-lg max-w-none">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {formData.title || "Your Post Title"}
                    </h1>
                    
                    {formData.featuredImage && (
                      <img 
                        src={formData.featuredImage} 
                        alt="Featured" 
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />
                    )}
                    
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {formData.content || "Your post content will appear here..."}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={addTag}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleSubmit("draft")}
                  disabled={updating}
                  variant="outline"
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updating ? "Saving..." : "Save as Draft"}
                </Button>
                
                <Button
                  onClick={() => handleSubmit("published")}
                  disabled={updating}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {updating ? "Publishing..." : "Update & Publish"}
                </Button>

                <Button
                  onClick={handleDelete}
                  disabled={updating}
                  variant="destructive"
                  className="w-full"
                >
                  {updating ? "Deleting..." : "Delete Post"}
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Editing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Changes are not saved automatically</li>
                  <li>• Use preview to see how your post looks</li>
                  <li>• Update the slug carefully - it changes the URL</li>
                  <li>• Published posts are visible to everyone</li>
                  <li>• Draft posts are only visible to you</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
