import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard - CarCollector',
  description: 'Your CarCollector dashboard',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Saved Cars', value: '12', icon: '🚗' },
            { label: 'Reviews Written', value: '5', icon: '✍️' },
            { label: 'Forum Posts', value: '23', icon: '💬' },
            { label: 'Subscription', value: 'Pro', icon: '⭐' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/cars" className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <span className="font-medium text-gray-900 dark:text-white">Browse Cars</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Discover new collector cars</p>
              </Link>
              <Link href="/forums" className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <span className="font-medium text-gray-900 dark:text-white">Visit Forums</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Join the community discussion</p>
              </Link>
              <Link href="/profile" className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <span className="font-medium text-gray-900 dark:text-white">Edit Profile</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your account settings</p>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'Saved a car', detail: '1973 Porsche 911 Carrera RS', time: '2 hours ago' },
                { action: 'Posted a reply', detail: 'in Market Analysis forum', time: '1 day ago' },
                { action: 'Wrote a review', detail: 'for 1967 Corvette Stingray', time: '3 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.detail} &middot; {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
