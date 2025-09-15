'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugInfo() {
  const { user, userProfile, loading, error, isFirebaseConfigured } = useAuth();

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <Card className="mt-8 border-2 border-yellow-300 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">🐛 Debug Info (Development Only)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <strong>Firebase Configured:</strong> {isFirebaseConfigured ? '✅ Yes' : '❌ No'}
        </div>
        
        <div>
          <strong>Auth Loading:</strong> {loading ? '⏳ Loading...' : '✅ Done'}
        </div>

        <div>
          <strong>Error:</strong> {error ? `❌ ${error}` : '✅ None'}
        </div>

        <div>
          <strong>User:</strong> 
          {user ? (
            <div className="ml-4 mt-1">
              <div>UID: {user.uid}</div>
              <div>Email: {user.email}</div>
              <div>Display Name: {user.displayName || 'Not set'}</div>
              <div>Email Verified: {user.emailVerified ? '✅' : '❌'}</div>
            </div>
          ) : (
            <span className="ml-2">❌ Not logged in</span>
          )}
        </div>

        <div>
          <strong>User Profile:</strong>
          {userProfile ? (
            <div className="ml-4 mt-1">
              <div>Name: {userProfile.name || 'Not set'}</div>
              <div>Role: {userProfile.role || 'Not set'}</div>
              <div>Profile Complete: {userProfile.profileComplete ? '✅' : '❌'}</div>
              <div>Major: {userProfile.major || 'Not set'}</div>
              <div>Graduation Year: {userProfile.graduationYear || 'Not set'}</div>
              <div>Created At: {userProfile.createdAt ? new Date(userProfile.createdAt.seconds ? userProfile.createdAt.seconds * 1000 : userProfile.createdAt).toLocaleString() : 'Not set'}</div>
              <div>Updated At: {userProfile.updatedAt ? new Date(userProfile.updatedAt.seconds ? userProfile.updatedAt.seconds * 1000 : userProfile.updatedAt).toLocaleString() : 'Not set'}</div>
            </div>
          ) : (
            <span className="ml-2">❌ No profile found</span>
          )}
        </div>

        <div>
          <strong>Environment Variables:</strong>
          <div className="ml-4 mt-1">
            <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set'}</div>
            <div>NEXT_PUBLIC_FIREBASE_API_KEY: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set'}</div>
            <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Not set'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
