'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Image, 
  Link2, 
  X, 
  Send,
  Hash
} from 'lucide-react';

export default function PostCreationDialog({ isOpen, onClose, onPostCreated }) {
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [post, setPost] = useState({
    content: '',
    tags: [],
    type: 'general' // general, question, announcement, opportunity
  });

  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !post.tags.includes(trimmedTag)) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post.content.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      // Here you would typically save to your database
      const newPost = {
        id: Date.now(), // In real app, this would come from your backend
        author: userProfile?.name || user?.displayName || 'Anonymous',
        role: userProfile?.role || 'Student',
        major: userProfile?.major || 'Unknown',
        graduationYear: userProfile?.graduationYear || 'Unknown',
        avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format`,
        content: post.content,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        tags: post.tags,
        type: post.type
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onPostCreated) {
        onPostCreated(newPost);
      }

      // Reset form
      setPost({
        content: '',
        tags: [],
        type: 'general'
      });
      
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white/95 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-gray-100">
          <CardTitle className="flex items-center text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            Create New Post
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* User Info */}
            <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md">
                {(userProfile?.name || user?.displayName || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {userProfile?.name || user?.displayName || 'Anonymous'}
                </p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Badge variant="outline" className="mr-2 text-xs bg-white border-blue-200 text-blue-700">
                    {userProfile?.role || 'Student'}
                  </Badge>
                  <span>{userProfile?.major || 'Unknown Major'}</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <Label htmlFor="content" className="text-sm font-medium text-gray-700 mb-2 block">What's on your mind?</Label>
              <textarea
                id="content"
                value={post.content}
                onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share something with the community..."
                className="w-full mt-2 px-4 py-4 border-0 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white min-h-[140px] resize-vertical transition-all duration-200 text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            {/* Post Type */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Post Type</Label>
              <select
                value={post.type}
                onChange={(e) => setPost(prev => ({ ...prev, type: e.target.value }))}
                className="w-full mt-2 px-4 py-3 border-0 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-700"
              >
                <option value="general">💬 General Discussion</option>
                <option value="question">❓ Question</option>
                <option value="opportunity">🚀 Opportunity</option>
                <option value="announcement">📢 Announcement</option>
              </select>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Tags</Label>
              <div className="flex gap-3 mt-2 mb-3">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags..."
                    className="pl-10 border-0 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                </div>
                <Button type="button" onClick={addTag} variant="outline" className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-300 rounded-xl px-4 transition-all duration-200">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-red-100 hover:text-red-700 transition-all duration-200 rounded-full px-3 py-1"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <div className="flex space-x-3">
                <Button type="button" variant="outline" size="sm" disabled className="bg-gray-50 text-gray-400 border-gray-200 rounded-full">
                  <Image className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button type="button" variant="outline" size="sm" disabled className="bg-gray-50 text-gray-400 border-gray-200 rounded-full">
                  <Link2 className="h-4 w-4 mr-2" />
                  Link
                </Button>
              </div>
              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={onClose} className="bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300 rounded-full px-6 transition-all duration-200">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !post.content.trim()} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full px-6 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
