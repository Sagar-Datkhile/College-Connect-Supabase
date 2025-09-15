'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, fallback }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback if not authenticated
  if (!user) {
    return fallback || (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated
  return children;
}

// Higher-order component for protecting actions
export function withAuthAction(action) {
  return (props) => {
    const { user } = useAuth();
    const router = useRouter();

    const handleAction = (...args) => {
      if (!user) {
        router.push('/login');
        return;
      }
      return action(...args);
    };

    return handleAction;
  };
}

// Hook for protected actions
export function useProtectedAction() {
  const { user } = useAuth();
  const router = useRouter();

  const executeWithAuth = (callback) => {
    if (!user) {
      router.push('/login');
      return;
    }
    return callback();
  };

  return executeWithAuth;
}
