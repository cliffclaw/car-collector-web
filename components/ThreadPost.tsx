import { ForumReply } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';

interface ThreadPostProps {
  reply: ForumReply;
}

export default function ThreadPost({ reply }: ThreadPostProps) {
  const username = reply.user?.username || 'Anonymous';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6" data-testid="thread-post">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-red-600 dark:text-red-400">
            {getInitials(username)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900 dark:text-white">{username}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(reply.created_at)}</span>
          </div>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{reply.content}</div>
        </div>
      </div>
    </div>
  );
}
