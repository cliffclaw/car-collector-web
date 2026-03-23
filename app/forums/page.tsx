import ForumCategoryCard from '@/components/ForumCategory';
import { forumCategories } from '@/lib/mock-data';

export const metadata = {
  title: 'Forums - CarCollector',
  description: 'Join the collector car community discussion',
};

export default function ForumsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Forums</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with fellow collectors, share knowledge, and discuss the market
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forumCategories.map((category) => (
          <ForumCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
