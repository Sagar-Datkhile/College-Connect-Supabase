
'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { GraduationCap, LogOut, User, Menu, X, BookOpen } from 'lucide-react';
import { Badge } from './ui/badge';
import { LoadingSpinner } from './ui/loading';
import { useState } from 'react';

export default function Navigation() {
  const { user, userProfile, logout, loading, error } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
          <Link href="/" className="font-bold text-lg text-gray-900">College Connect</Link>
        </div>
        <LoadingSpinner size="sm" />
      </nav>
    );
  }

  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
          <Link href="/" className="font-bold text-lg text-gray-900">College Connect</Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <Link href="/posts" className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                  <BookOpen className="h-4 w-4" />
                  Blog Posts
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 max-w-32 truncate">
                  {userProfile?.name || user.displayName || user.email}
                </span>
                {userProfile?.role && (
                  <Badge variant={userProfile.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
                    {userProfile.role}
                  </Badge>
                )}
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <LoadingSpinner size="sm" className="mr-1" />
                ) : (
                  <LogOut className="h-4 w-4 mr-1" />
                )}
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/posts" className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                <BookOpen className="h-4 w-4" />
                Blog Posts
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-sm">
          <div className="p-4 space-y-4">
            {user ? (
              <>
                <Link href="/posts" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Blog Posts
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pb-2 border-b">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {userProfile?.name || user.displayName || user.email}
                  </span>
                  {userProfile?.role && (
                    <Badge variant={userProfile.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
                      {userProfile.role}
                    </Badge>
                  )}
                </div>
                <Button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Link href="/posts" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Blog Posts
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-start">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="fixed top-20 right-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 shadow-lg z-50 max-w-xs">
          {error}
        </div>
      )}
    </>
  );
}
