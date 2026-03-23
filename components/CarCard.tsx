import Link from 'next/link';
import { Car } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function CarCard({ car }: { car: Car }) {
  const categoryColors: Record<string, string> = {
    classic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    muscle: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    exotic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    luxury: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    sports: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <Link href={`/cars/${car.id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <div className="aspect-[16/10] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🏎️</div>
              <p className="text-sm font-medium">{car.year} {car.make}</p>
            </div>
          </div>
          {car.is_premium && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              PREMIUM
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[car.category]}`}>
              {car.category.charAt(0).toUpperCase() + car.category.slice(1)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{car.year}</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {car.make} {car.model}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {car.description.slice(0, 100)}...
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-red-600 dark:text-red-400">
              {formatPrice(car.price)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {car.specs.horsepower} HP
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
