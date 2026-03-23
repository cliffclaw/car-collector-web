'use client';

import { useState, useMemo } from 'react';
import CarCard from '@/components/CarCard';
import { cars } from '@/lib/mock-data';

const categories = ['all', 'classic', 'muscle', 'exotic', 'luxury', 'sports'] as const;

export default function CarsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-desc');

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (car) =>
          car.make.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.year.toString().includes(q)
      );
    }

    if (category !== 'all') {
      result = result.filter((car) => car.category === category);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'year-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
    }

    return result;
  }, [search, category, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Collector Cars</h1>
        <p className="text-gray-600 dark:text-gray-400">Browse our curated collection of the world&apos;s finest collector cars</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by make, model, or year..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              data-testid="car-search"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              data-testid="category-filter"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              data-testid="sort-select"
            >
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="year-desc">Year: Newest</option>
              <option value="year-asc">Year: Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4" data-testid="results-count">
        Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
      </p>

      {/* Car Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No cars found matching your criteria.</p>
          <button
            onClick={() => { setSearch(''); setCategory('all'); }}
            className="mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
