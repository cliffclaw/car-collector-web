import { Metadata } from 'next';
import { getDVLAData } from '@/lib/mock-research';

export const metadata: Metadata = {
  title: 'Analytics - CarCollector',
  description: 'UK road registration data and market analytics for rare collectible cars',
};

export default async function AnalyticsPage() {
  const dvlaData = getDVLAData();
  const totalRegistered = dvlaData.reduce((sum, d) => sum + d.registered, 0);
  const totalTaxed = dvlaData.reduce((sum, d) => sum + d.taxed, 0);
  const totalSORN = dvlaData.reduce((sum, d) => sum + d.sot, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Market Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          UK registration data, price trends, and investment insights
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Registered</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalRegistered.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Across all tracked models
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Currently Taxed</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {totalTaxed.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            On the road today
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">SORN</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {totalSORN.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Statutory off the road
          </p>
        </div>
      </div>

      {/* DVLA Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            UK Road Registrations by Model
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Data from DVLA - Last updated March 2024
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Make & Model
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Taxed
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SORN
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  On Road %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dvlaData.map((car) => {
                const onRoadPct = Math.round((car.taxed / car.registered) * 100);
                return (
                  <tr key={`${car.make}-${car.model}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {car.make}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        {car.model}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">
                      {car.registered.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 dark:text-green-400">
                      {car.taxed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-orange-600 dark:text-orange-400">
                      {car.sot.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        onRoadPct >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        onRoadPct >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {onRoadPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            📊 Key Insights
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Jaguar E-Type has the highest surviving population at 2,847 registered
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              TVR Tuscan has 89% of cars still on the road (high usage)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">!</span>
              Aston Martin DB5 is rarest with only 312 surviving in UK
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">!</span>
              Porsche 911 shows lower road usage - possibly garageed as investments
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            💡 Investment Implications
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-red-500">↑</span>
              <span>Low survival rates correlate with higher values</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">↑</span>
              <span>High SORN suggests cars are being held as investments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">↑</span>
              <span>DB5's rarity makes it a premium investment target</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">-</span>
              <span>TVR's popularity means good liquidity but higher supply</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}