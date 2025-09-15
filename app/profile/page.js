'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProfileDashboard } from '@/components/profile/profile-dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ProfilePage() {
  const { user, userProfile, updateUserProfile, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Normalize user data for the ProfileDashboard component
  const normalizeUserData = (userProfile, user) => {
    if (!userProfile || !user) return null;

    // Map the user profile data structure to match what ProfileView expects
    return {
      name: userProfile.name || user.displayName || '',
      email: userProfile.email || user.email || '',
      bio: userProfile.bio || '',
      location: userProfile.location || '',
      major: userProfile.major || '',
      graduationYear: userProfile.graduationYear || '',
      currentPosition: userProfile.currentPosition || '',
      company: userProfile.company || '',
      skills: userProfile.skills || [],
      interests: userProfile.interests || [],
      achievements: userProfile.achievements || [],
      // Handle social links - convert from nested structure to flat structure
      website: userProfile.socialLinks?.portfolio || userProfile.website || '',
      linkedin: userProfile.socialLinks?.linkedin || userProfile.linkedin || '',
      github: userProfile.socialLinks?.github || userProfile.github || '',
      twitter: userProfile.socialLinks?.twitter || userProfile.twitter || '',
      mentorshipStatus: userProfile.mentorshipStatus || 'seeking',
      role: userProfile.role || 'student',
      verified: userProfile.verified || false,
      profileComplete: userProfile.profileComplete || false,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt
    };
  };

  useEffect(() => {
    if (!loading && user && userProfile) {
      setIsLoading(false);
    } else if (!loading && user && !userProfile) {
      // If user exists but no profile, redirect to profile setup
      console.log('User exists but no profile found, redirecting to setup');
      router.push('/profile/setup');
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [user, userProfile, loading, router]);

  // Enhanced handleSaveProfile function to work with the actual updateUserProfile
  const handleSaveProfile = async (profileData) => {
    try {
      setIsLoading(true);
      
      // Convert flat structure back to the expected structure
      const updatedProfile = {
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        major: profileData.major,
        graduationYear: profileData.graduationYear,
        currentPosition: profileData.currentPosition,
        company: profileData.company,
        skills: profileData.skills,
        interests: profileData.interests,
        achievements: profileData.achievements,
        socialLinks: {
          portfolio: profileData.website,
          linkedin: profileData.linkedin,
          github: profileData.github,
          twitter: profileData.twitter
        },
        profileComplete: true,
        updatedAt: new Date()
      };

      await updateUserProfile(updatedProfile);
      // Success message could be added here
    } catch (error) {
      console.error('Error updating profile:', error);
      // Error handling could be added here
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Profile not found. Redirecting...</p>
        </div>
      </div>
    );
  }

  const normalizedUser = normalizeUserData(userProfile, user);

  if (!normalizedUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileDashboard 
          user={normalizedUser} 
          isOwnProfile={true} 
          onSaveProfile={handleSaveProfile}
        />
      </div>
    </div>
  );
}

export default function ProfilePageWithProtection() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
