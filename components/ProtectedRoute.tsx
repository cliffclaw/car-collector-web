'use client';

import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredTier?: 'free' | 'pro' | 'collector';
}

export default function ProtectedRoute({ children, requiredTier }: ProtectedRouteProps) {
  // In production, this would check Supabase auth session
  // For now, we show the content with a login prompt overlay
  const isAuthenticated = false;
  const userTier = 'free';

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Sign in required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to access this page.
          </p>
          <div className="space-x-4">
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-lg transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (requiredTier && requiredTier !== 'free') {
    const tierOrder = ['free', 'pro', 'collector'];
    const userTierIndex = tierOrder.indexOf(userTier);
    const requiredTierIndex = tierOrder.indexOf(requiredTier);

    if (userTierIndex < requiredTierIndex) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Premium Feature</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This feature requires a {requiredTier} subscription or higher.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              View Plans
            </Link>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
