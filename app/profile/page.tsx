import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import CarCard from '@/components/CarCard';
import { cars } from '@/lib/mock-data';

export const metadata = {
  title: 'Profile - CarCollector',
  description: 'Your CarCollector profile',
};

export default function ProfilePage() {
  // Mock saved cars - first 3
  const savedCars = cars.slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">JD</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">John Doe</h1>
              <p className="text-gray-500 dark:text-gray-400">john@example.com</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full">
                  Pro Member
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Member since Jan 2024
                </span>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Saved Cars */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Cars</h2>
            <Link href="/cars" className="text-red-600 hover:text-red-700 text-sm font-medium">
              Browse more
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account</h2>
          <div className="space-y-3">
            <Link href="/pricing" className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <span className="font-medium text-gray-900 dark:text-white">Manage Subscription</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">View or change your current plan</p>
            </Link>
            <Link href="/dashboard" className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <span className="font-medium text-gray-900 dark:text-white">Dashboard</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">View your activity and stats</p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
