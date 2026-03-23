import Link from 'next/link';
import { ForumThread } from '@/types';
import { formatDate } from '@/lib/utils';

interface ThreadListProps {
  threads: ForumThread[];
  categorySlug: string;
}

export default function ThreadList({ threads, categorySlug }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No threads yet. Be the first to start a discussion!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {threads.map((thread) => (
        <Link
          key={thread.id}
          href={`/forums/${categorySlug}/${thread.id}`}
          className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
          data-testid={`thread-${thread.id}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {thread.is_pinned && (
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded font-medium">
                    Pinned
                  </span>
                )}
                {thread.is_locked && (
                  <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded font-medium">
                    🔒 Locked
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400">
                {thread.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {thread.content}
              </p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{thread.reply_count} replies</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(thread.created_at)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
