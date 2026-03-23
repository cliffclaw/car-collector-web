import { Metadata } from 'next';
import Link from 'next/link';
import ResearchCard from '@/components/ResearchCard';
import { researchReports } from '@/lib/mock-research';

export const metadata: Metadata = {
  title: 'Research - CarCollector',
  description: 'Deep research and investment analysis for rare collectible cars',
};

export default async function ResearchPage() {
  const featuredReport = researchReports.find(r => r.is_premium) || researchReports[0];
  const otherReports = researchReports.filter(r => r.id !== featuredReport.id);
  
  // Group by make
  const makes = [...new Set(researchReports.map(r => r.car_make).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Research & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep analysis of the rare car market • Investment guides • UK registration data
        </p>
      </div>

      {/* Filter by Make */}
      <div className="mb-8 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 py-2">Filter by:</span>
        <Link
          href="/research"
          className="px-3 py-1 rounded-full text-sm bg-red-600 text-white"
        >
          All
        </Link>
        {makes.map((make) => (
          make && (
            <Link
              key={make}
              href={`/research?make=${make}`}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {make}
            </Link>
          )
        ))}
      </div>

      {/* Featured Report */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Featured Analysis
        </h2>
        <ResearchCard report={featuredReport} featured />
      </div>

      {/* More Reports */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          More Research
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherReports.map((report) => (
            <ResearchCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
}