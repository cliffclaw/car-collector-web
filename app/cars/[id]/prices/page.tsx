'use client';

import Link from 'next/link';
import { cars, priceHistories } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import PriceChart from '@/components/PriceChart';
import SubscriptionGate from '@/components/SubscriptionGate';

export default function PriceHistoryPage({ params }: { params: { id: string } }) {
  const car = cars.find((c) => c.id === params.id);
  const prices = priceHistories.filter((p) => p.car_id === params.id);

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Car not found</h1>
      </div>
    );
  }

  const sortedPrices = [...prices].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestPrice = sortedPrices[sortedPrices.length - 1];
  const earliestPrice = sortedPrices[0];
  const priceChange = latestPrice && earliestPrice
    ? ((latestPrice.price - earliestPrice.price) / earliestPrice.price) * 100
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/cars" className="text-red-600 hover:text-red-700">Cars</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href={`/cars/${car.id}`} className="text-red-600 hover:text-red-700">
          {car.year} {car.make} {car.model}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600 dark:text-gray-400">Price History</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Price History: {car.year} {car.make} {car.model}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Track market value trends over time
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(car.price)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">10-Year Change</p>
          <p className={`text-2xl font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Data Points</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{prices.length}</p>
        </div>
      </div>

      {/* Chart - Gated for premium */}
      <SubscriptionGate requiredTier="pro" featureName="Historical Price Charts">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Price Trend</h2>
          <PriceChart data={sortedPrices} isPremium={true} />
        </div>
      </SubscriptionGate>

      {/* Price Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white p-6 pb-4">Price History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Source</th>
              </tr>
            </thead>
            <tbody>
              {sortedPrices.slice(-10).reverse().map((price) => (
                <tr key={price.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">
                    {new Date(price.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatPrice(price.price)}</td>
                  <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">{price.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
