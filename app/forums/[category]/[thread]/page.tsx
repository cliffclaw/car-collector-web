'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThreadPost from '@/components/ThreadPost';
import { forumCategories, forumThreads, forumReplies } from '@/lib/mock-data';
import { formatDate, getInitials } from '@/lib/utils';

export default function ThreadPage({ params }: { params: { category: string; thread: string } }) {
  const [replyContent, setReplyContent] = useState('');

  const category = forumCategories.find((c) => c.slug === params.category);
  const thread = forumThreads.find((t) => t.id === params.thread);

  if (!category || !thread) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thread not found</h1>
        <Link href="/forums" className="text-red-600 hover:text-red-700 mt-4 inline-block">
          Back to Forums
        </Link>
      </div>
    );
  }

  const replies = forumReplies.filter((r) => r.thread_id === thread.id);
  const authorName = thread.user?.username || 'Anonymous';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/forums" className="text-red-600 hover:text-red-700">Forums</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href={`/forums/${category.slug}`} className="text-red-600 hover:text-red-700">{category.name}</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600 dark:text-gray-400 line-clamp-1">{thread.title}</span>
      </nav>

      {/* Thread Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4" data-testid="thread-title">
          {thread.title}
        </h1>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-red-600 dark:text-red-400">
              {getInitials(authorName)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">{authorName}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(thread.created_at)}</span>
            </div>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{thread.content}</div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
      </h2>

      <div className="space-y-4 mb-8">
        {replies.map((reply) => (
          <ThreadPost key={reply.id} reply={reply} />
        ))}
      </div>

      {/* Reply Form */}
      {!thread.is_locked && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Post a Reply</h3>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
            data-testid="reply-textarea"
          />
          <div className="flex justify-end mt-3">
            <button
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              data-testid="reply-submit"
            >
              Post Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
