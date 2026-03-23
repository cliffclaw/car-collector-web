import { Metadata } from 'next';
import ListingCard from '@/components/ListingCard';
import { carListings, filterListings } from '@/lib/mock-listings';

export const metadata: Metadata = {
  title: 'Car Listings - CarCollector',
  description: 'Browse rare and collectible cars from across Europe',
};

const countries = [
  { code: 'UK', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', flag: '🇫🇷', name: 'France' },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands' },
];

const sources = [
  { code: 'autotrader', name: 'AutoTrader' },
  { code: 'pistonheads', name: 'PistonHeads' },
  { code: 'carandclassic', name: 'Car & Classic' },
  { code: 'mobile_de', name: 'Mobile.de' },
  { code: 'autoscout24', name: 'AutoScout24' },
];

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; make?: string; minPrice?: string; maxPrice?: string; source?: string }>;
}) {
  const params = await searchParams;
  
  const filters = {
    country: params.country,
    make: params.make,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    source: params.source,
  };

  const filteredListings = filterListings(carListings, filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Rare Car Listings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aggregated from across Europe • {filteredListings.length} listings found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sticky top-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
            
            {/* Country Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <div className="space-y-1">
                <a
                  href="/listings"
                  className={`block px-3 py-2 rounded-lg text-sm ${!params.country ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  All Countries
                </a>
                {countries.map((c) => (
                  <a
                    key={c.code}
                    href={`/listings?country=${c.code}${params.make ? `&make=${params.make}` : ''}`}
                    className={`block px-3 py-2 rounded-lg text-sm ${params.country === c.code ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {c.flag} {c.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Make Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Make
              </label>
              <input
                type="text"
                placeholder="Search make..."
                defaultValue={params.make}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  if (e.target.value) {
                    url.searchParams.set('make', e.target.value);
                  } else {
                    url.searchParams.delete('make');
                  }
                  window.location.href = url.toString();
                }}
              />
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range (GBP)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={params.minPrice}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={params.maxPrice}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source
              </label>
              <div className="space-y-1">
                <a
                  href={`/listings${params.country ? `?country=${params.country}` : ''}`}
                  className={`block px-3 py-2 rounded-lg text-sm ${!params.source ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  All Sources
                </a>
                {sources.map((s) => (
                  <a
                    key={s.code}
                    href={`/listings?source=${s.code}${params.country ? `&country=${params.country}` : ''}`}
                    className={`block px-3 py-2 rounded-lg text-sm ${params.source === s.code ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No listings match your filters. Try adjusting your search criteria.
              </p>
              <a
                href="/listings"
                className="inline-block mt-4 text-red-600 dark:text-red-400 hover:underline"
              >
                Clear all filters
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}