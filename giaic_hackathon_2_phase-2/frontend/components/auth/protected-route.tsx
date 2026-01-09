'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, fallback = null }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  // Show fallback or nothing while checking authentication
  if (loading || !user) {
    return fallback || <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;