import Link from 'next/link';
import { CarListing } from '@/types';
import { getCountryFlag, getSourceName } from '@/lib/mock-listings';

interface ListingCardProps {
  listing: CarListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(price);
  };

  const formatMileage = (mileage: number | undefined) => {
    if (!mileage) return 'N/A';
    return new Intl.NumberFormat('en-GB').format(mileage) + ' miles';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image - use only real listing images */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        <img
          src={listing.images?.[0] || '/placeholder-car.jpg'}
          alt={`${listing.make} ${listing.model}`}
          className="w-full h-full object-cover"
        />
        {/* Country Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/70 text-white">
            {getCountryFlag(listing.country)} {listing.country}
          </span>
        </div>
        {/* Source Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300">
            {getSourceName(listing.source)}
          </span>
        </div>
        {/* Fair Value Indicator */}
        <div className="absolute bottom-3 right-3">
          {listing.is_fair_value === true ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              ✓ Fair Price
            </span>
          ) : listing.is_fair_value === false ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              ↑ Above Market
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {listing.make} {listing.model}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {listing.year}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(listing.price, listing.currency)}
            </p>
            {listing.price_vs_market_pct !== undefined && (
              <p className={`text-xs ${listing.price_vs_market_pct < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {listing.price_vs_market_pct > 0 ? '+' : ''}{listing.price_vs_market_pct}% vs avg
              </p>
            )}
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-3">
          {listing.mileage && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              🚗 {formatMileage(listing.mileage)}
            </span>
          )}
          {listing.fuel_type && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              ⛽ {listing.fuel_type}
            </span>
          )}
          {listing.transmission && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              ⚙️ {listing.transmission}
            </span>
          )}
        </div>

        {/* Location */}
        {listing.region && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
            📍 {listing.region}, {listing.country}
          </p>
        )}

        {/* CTA */}
        <a
          href={listing.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          View Listing →
        </a>
      </div>
    </div>
  );
}