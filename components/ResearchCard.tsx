import Link from 'next/link';
import { ResearchReport } from '@/types';
import { Lock } from 'lucide-react';

interface ResearchCardProps {
  report: ResearchReport;
  featured?: boolean;
}

const ratingColors = {
  excellent: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  good: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  moderate: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  speculative: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function ResearchCard({ report, featured = false }: ResearchCardProps) {
  const ratingColor = report.investment_rating ? ratingColors[report.investment_rating] : '';

  if (featured) {
    return (
      <Link
        href={`/research/${report.slug}`}
        className="group relative grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
      >
        <div className="relative h-64 md:h-full">
          <img
            src={report.cover_image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'}
            alt={report.title}
            className="w-full h-full object-cover"
          />
          {report.is_premium && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                <Lock size={14} className="mr-1" />
                Premium
              </span>
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col justify-center">
          {report.investment_rating && (
            <span className={`inline-flex self-start px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${ratingColor}`}>
              {report.investment_rating.charAt(0).toUpperCase() + report.investment_rating.slice(1)} Investment
            </span>
          )}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {report.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {report.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
            {report.car_make && (
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {report.car_make} {report.car_model}
              </span>
            )}
            {report.published_at && (
              <span>
                {new Date(report.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/research/${report.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <img
          src={report.cover_image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'}
          alt={report.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {report.is_premium && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              <Lock size={12} className="mr-1" />
              Premium
            </span>
          </div>
        )}
        {report.investment_rating && (
          <div className="absolute top-3 left-3">
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${ratingColor}`}>
              {report.investment_rating.charAt(0).toUpperCase() + report.investment_rating.slice(1)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {report.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {report.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          {report.car_make && (
            <span className="font-medium">
              {report.car_make} {report.car_model}
            </span>
          )}
          {report.published_at && (
            <span>
              {new Date(report.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}