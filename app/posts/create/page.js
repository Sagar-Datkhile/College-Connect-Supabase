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
import { Loader2, Plus, X, Eye, Save, Send } from "lucide-react"
import { toast } from "sonner"

export default function CreatePostPage() {
  const { user, getIdToken } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
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
    }
  }, [user, router])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-generate slug from title
    if (field === "title" && !formData.slug) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setFormData(prev => ({
        ...prev,
        slug: slug
      }))
    }
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

    setLoading(true)
    try {
      const token = await getIdToken()
      const postData = {
        ...formData,
        status: publishStatus,
        excerpt: formData.excerpt || formData.content.substring(0, 200) + "..."
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create post")
      }

      toast.success(`Post ${publishStatus === 'published' ? 'published' : 'saved'} successfully!`)
      router.push(`/posts/${result.slug}`)
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error(error.message || "Failed to create post")
    } finally {
      setLoading(false)
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600">
            Share your thoughts, experiences, and knowledge with the college community
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
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save as Draft"}
                </Button>
                
                <Button
                  onClick={() => handleSubmit("published")}
                  disabled={loading}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Publishing..." : "Publish Post"}
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Writing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Use a clear, engaging title</li>
                  <li>• Start with a compelling introduction</li>
                  <li>• Break content into readable paragraphs</li>
                  <li>• Add relevant tags for discoverability</li>
                  <li>• Include a featured image if possible</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
