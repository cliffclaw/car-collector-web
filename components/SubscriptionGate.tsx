'use client';

import Link from 'next/link';

interface SubscriptionGateProps {
  children: React.ReactNode;
  requiredTier: 'pro' | 'collector';
  featureName?: string;
}

export default function SubscriptionGate({ children, requiredTier, featureName }: SubscriptionGateProps) {
  // In production, check user's subscription tier from context/session
  const userTier = 'free';
  const tierOrder = ['free', 'pro', 'collector'];
  const hasAccess = tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier);

  if (!hasAccess) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {featureName || 'Premium Feature'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Upgrade to {requiredTier} to unlock this feature.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
