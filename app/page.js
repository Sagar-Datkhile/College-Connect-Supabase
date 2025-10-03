"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProtectedAction } from "@/components/ProtectedRoute";
import PostCreationDialog from "@/components/PostCreationDialog";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  MessageSquare,
  BookOpen,
  UserCheck,
  LogIn,
  UserPlus,
  Heart,
  Share,
  Clock,
  MapPin,
  Briefcase,
  TrendingUp,
  Star,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import heavy components for better code splitting
const StatsCards = dynamic(
  () =>
    import("@/components/dashboard/stats-cards").then((mod) => ({
      default: mod.StatsCards,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-24 rounded"></div>
    ),
    ssr: false,
  }
);

const RecentActivity = dynamic(
  () =>
    import("@/components/dashboard/recent-activity").then((mod) => ({
      default: mod.RecentActivity,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

const UpcomingEvents = dynamic(
  () =>
    import("@/components/dashboard/upcoming-events").then((mod) => ({
      default: mod.UpcomingEvents,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

const MentorshipSuggestions = dynamic(
  () =>
    import("@/components/dashboard/mentorship-suggestions").then((mod) => ({
      default: mod.MentorshipSuggestions,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

// Admin components - only load when needed
const PlatformStats = dynamic(
  () =>
    import("@/components/admin/platform-stats").then((mod) => ({
      default: mod.PlatformStats,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

const UserManagement = dynamic(
  () =>
    import("@/components/admin/user-management").then((mod) => ({
      default: mod.UserManagement,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

const ContentModeration = dynamic(
  () =>
    import("@/components/admin/content-moderation").then((mod) => ({
      default: mod.ContentModeration,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

const SystemSettings = dynamic(
  () =>
    import("@/components/admin/system-settings").then((mod) => ({
      default: mod.SystemSettings,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

// Other dashboard components
const MentorshipDashboard = dynamic(
  () =>
    import("@/components/mentorship/mentorship-dashboard").then((mod) => ({
      default: mod.MentorshipDashboard,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

const DiscussionDashboard = dynamic(
  () =>
    import("@/components/discussions/discussion-dashboard").then((mod) => ({
      default: mod.DiscussionDashboard,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

const ProfileDashboard = dynamic(
  () =>
    import("@/components/profile/profile-dashboard").then((mod) => ({
      default: mod.ProfileDashboard,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
    ),
    ssr: false,
  }
);

export default function CollegePlatform() {
  const { user, userProfile } = useAuth();
  const executeWithAuth = useProtectedAction();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Sarah Johnson",
      role: "Alumni",
      major: "Computer Science",
      graduationYear: "2021",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format",
      content:
        "Just landed my dream job at Google! Happy to mentor current CS students who are preparing for tech interviews. Feel free to reach out!",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      tags: ["Career", "Tech", "Mentorship"],
    },
    {
      id: 2,
      author: "Michael Chen",
      role: "Student",
      major: "Business Administration",
      graduationYear: "2024",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format",
      content:
        "Looking for study partners for the upcoming Finance exam. Anyone interested in forming a study group? We could meet at the library this weekend.",
      timestamp: "4 hours ago",
      likes: 12,
      comments: 15,
      tags: ["Study Group", "Finance"],
    },
    {
      id: 3,
      author: "Dr. Emily Rodriguez",
      role: "Faculty",
      major: "Psychology",
      graduationYear: "Faculty",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
      content:
        "Excited to announce our new Psychology Research Lab is now open for student volunteers! Great opportunity to gain hands-on research experience. Applications due next Friday.",
      timestamp: "1 day ago",
      likes: 45,
      comments: 22,
      tags: ["Research", "Opportunity", "Psychology"],
    },
  ]);

  const handleLike = (postId) => {
    executeWithAuth(() => {
      console.log("Liked post:", postId);
      // Here you would update the like count
    });
  };

  const handleComment = (postId) => {
    executeWithAuth(() => {
      console.log("Comment on post:", postId);
      // Here you would open comment dialog
    });
  };

  const handleConnect = (authorName) => {
    executeWithAuth(() => {
      console.log("Connect with:", authorName);
      // Here you would send connection request
    });
  };

  const handleCreatePost = () => {
    executeWithAuth(() => {
      setIsPostDialogOpen(true);
    });
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-500 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px_16px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="flex flex-col">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex justify-center items-center">
                  <GraduationCap className="h-16 w-16" />
                </div>

                <h1 className="bg-slate-100 text-black rounded-full p-3 mt-4  font-bold ">
                  Explore • Connect • Grow
                </h1>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Scholar Mentor
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100 leading-relaxed">
              Join thousands of students, alumni, and faculty connecting,
              learning, and growing together in our vibrant academic community
            </p>

            {!user && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 text-black border-white/30 backdrop-blur-sm hover:bg-white/10 hover:border-white hover:text-white transition-all duration-300 rounded-full"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 rounded-full shadow-lg"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="font-bold text-2xl mb-2">5,000+</h3>
                <p className="text-blue-100 font-medium">Active Members</p>
                <p className="text-blue-200 text-sm mt-1">
                  Students, Alumni & Faculty
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                  <MessageSquare className="h-10 w-10" />
                </div>
                <h3 className="font-bold text-2xl mb-2">500+</h3>
                <p className="text-blue-100 font-medium">Monthly Discussions</p>
                <p className="text-blue-200 text-sm mt-1">
                  Knowledge & Networking
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                  <TrendingUp className="h-10 w-10" />
                </div>
                <h3 className="font-bold text-2xl mb-2">95%</h3>
                <p className="text-blue-100 font-medium">Success Rate</p>
                <p className="text-blue-200 text-sm mt-1">Career Placement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mr-3">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 transition-all duration-200"
                  onClick={handleCreatePost}
                  variant="outline"
                >
                  <MessageSquare className="h-4 w-4 mr-3" />
                  Create Post
                </Button>
                <Link href="/alumni" className="w-full">
                  <Button
                    className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300 transition-all duration-200"
                    variant="outline"
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Connect with Alumni
                  </Button>
                </Link>
                <Button
                  className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 transition-all duration-200"
                  onClick={() =>
                    executeWithAuth(() => console.log("Join study group"))
                  }
                  variant="outline"
                >
                  <BookOpen className="h-4 w-4 mr-3" />
                  Join Study Groups
                </Button>
                {user && (
                  <Link href="/profile" className="w-full">
                    <Button
                      className="w-full justify-start bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 hover:border-indigo-300 transition-all duration-200"
                      variant="outline"
                    >
                      <UserCheck className="h-4 w-4 mr-3" />
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg mr-3">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      name: "Career Advice",
                      color: "bg-blue-100 text-blue-700 border-blue-200",
                    },
                    {
                      name: "Study Tips",
                      color: "bg-green-100 text-green-700 border-green-200",
                    },
                    {
                      name: "Internships",
                      color: "bg-purple-100 text-purple-700 border-purple-200",
                    },
                    {
                      name: "Research",
                      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
                    },
                    {
                      name: "Networking",
                      color: "bg-pink-100 text-pink-700 border-pink-200",
                    },
                  ].map((topic) => (
                    <Badge
                      key={topic.name}
                      className={`${topic.color} hover:scale-105 transition-transform cursor-pointer`}
                    >
                      #{topic.name.replace(" ", "")}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6">
            {/* Community Feed Header */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Community Feed
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Discover what's happening in your college community
                  </p>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Image
                          src={post.avatar}
                          alt={post.author}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full mr-3"
                          priority={false}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyAgQTzSlT54b0/QTpfwcOvo+9lqiTg8y5Ec+/"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {post.author}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2 text-xs">
                              {post.role}
                            </Badge>
                            <span>
                              {post.major} • {post.graduationYear}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.timestamp}
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Post Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100/80">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full px-3 py-2 transition-all duration-200"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleComment(post.id)}
                          className="text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full px-3 py-2 transition-all duration-200"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {post.comments}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-full px-3 py-2 transition-all duration-200"
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      {post.role === "Alumni" && (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(post.author)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full px-4 py-2 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            {/* Alumni Spotlight */}
            <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg mr-3">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  Alumni Spotlight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Image
                      src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=50&h=50&fit=crop&crop=face&auto=format"
                      alt="Alumni"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full mr-3"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyAgQTzSlT54b0/QTpfwcOvo+9lqiTg8y5Ec+/"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">David Kim</p>
                      <p className="text-xs text-gray-500">
                        Software Engineer at Apple
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        executeWithAuth(() => console.log("View profile"))
                      }
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-300 rounded-full px-3 py-1 transition-all duration-200"
                    >
                      View
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <Image
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face&auto=format"
                      alt="Alumni"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full mr-3"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyAgQTzSlT54b0/QTpfwcOvo+9lqiTg8y5Ec+/"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Lisa Zhang</p>
                      <p className="text-xs text-gray-500">
                        Product Manager at Netflix
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        executeWithAuth(() => console.log("View profile"))
                      }
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-300 rounded-full px-3 py-1 transition-all duration-200"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mr-3">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-sm text-gray-800">
                      Career Fair
                    </h4>
                    <div className="flex items-center text-xs text-gray-600 mt-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      Main Auditorium
                    </div>
                    <div className="flex items-center text-xs text-blue-600 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Tomorrow, 10:00 AM
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-sm text-gray-800">
                      Alumni Networking
                    </h4>
                    <div className="flex items-center text-xs text-gray-600 mt-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      Student Center
                    </div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Friday, 6:00 PM
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Post Creation Dialog */}
      <PostCreationDialog
        isOpen={isPostDialogOpen}
        onClose={() => setIsPostDialogOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
