import Link from 'next/link';
import { notFound } from 'next/navigation';
import ThreadList from '@/components/ThreadList';
import { forumCategories, forumThreads } from '@/lib/mock-data';

export function generateStaticParams() {
  return forumCategories.map((cat) => ({ category: cat.slug }));
}

export default async function ForumCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = forumCategories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const threads = forumThreads.filter((t) => t.category_id === category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/forums" className="text-red-600 hover:text-red-700">Forums</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{category.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
        </div>
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition hidden sm:block"
        >
          New Thread
        </Link>
      </div>

      <ThreadList threads={threads} categorySlug={category.slug} />
    </div>
  );
}
