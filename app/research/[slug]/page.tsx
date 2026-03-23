import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { researchReports } from '@/lib/mock-research';
import { Lock } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return researchReports.map((report) => ({
    slug: report.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const report = researchReports.find((r) => r.slug === slug);
  
  if (!report) return { title: 'Not Found' };
  
  return {
    title: `${report.title} - CarCollector Research`,
    description: report.excerpt,
  };
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const report = researchReports.find((r) => r.slug === slug);
  
  if (!report) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        href="/research"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 mb-6"
      >
        ← Back to Research
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {report.investment_rating && (
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              report.investment_rating === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              report.investment_rating === 'good' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            }`}>
              {report.investment_rating.charAt(0).toUpperCase() + report.investment_rating.slice(1)} Investment
            </span>
          )}
          {report.is_premium && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              <Lock size={14} className="mr-1" />
              Premium Content
            </span>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {report.title}
        </h1>
        
        {report.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {report.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400">
          {report.car_make && (
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {report.car_make} {report.car_model}
            </span>
          )}
          {report.road_registered_uk && (
            <span className="flex items-center gap-1">
              🚗 {report.road_registered_uk.toLocaleString()} UK road registered
            </span>
          )}
          {report.rarity_score && (
            <span className="flex items-center gap-1">
              ⭐ Rarity: {report.rarity_score}/10
            </span>
          )}
          {report.published_at && (
            <span>
              {new Date(report.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {report.cover_image && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={report.cover_image}
            alt={report.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}

      {/* Content */}
      {report.content ? (
        <div className="prose dark:prose-invert max-w-none">
          {report.content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) {
              return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={i} className="text-xl font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="ml-4">{line.slice(2)}</li>;
            }
            if (line.startsWith('|')) {
              return null; // Skip table rendering for simplicity
            }
            if (line.trim() === '') {
              return <br key={i} />;
            }
            return <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">{line}</p>;
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Premium Research
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is a premium research report. Subscribe to access full analysis.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            View Plans
          </Link>
        </div>
      )}

      {/* Related Reports */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Related Research
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {researchReports
            .filter(r => r.id !== report.id && r.car_make === report.car_make)
            .slice(0, 2)
            .map(r => (
              <Link
                key={r.id}
                href={`/research/${r.slug}`}
                className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{r.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.excerpt?.slice(0, 100)}...</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}