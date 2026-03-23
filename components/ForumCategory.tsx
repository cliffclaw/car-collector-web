import Link from 'next/link';
import { ForumCategory as ForumCategoryType } from '@/types';

interface ForumCategoryProps {
  category: ForumCategoryType;
}

const iconMap: Record<string, string> = {
  '💬': '💬',
  '🚗': '🚗',
  '📊': '📊',
  '🔧': '🔧',
  '💰': '💰',
  '🎪': '🎪',
};

export default function ForumCategoryCard({ category }: ForumCategoryProps) {
  return (
    <Link
      href={`/forums/${category.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
      data-testid={`forum-category-${category.slug}`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{iconMap[category.icon] || '💬'}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{category.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{category.description}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {category.thread_count} {category.thread_count === 1 ? 'thread' : 'threads'}
          </p>
        </div>
      </div>
    </Link>
  );
}
