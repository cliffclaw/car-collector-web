import Link from 'next/link';
import { CarReview } from '@/types';
import { cars } from '@/lib/mock-data';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }: { review: CarReview }) {
  const car = cars.find((c) => c.id === review.car_id);

  return (
    <Link href={`/reviews/${review.id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
        {review.is_premium && (
          <span className="inline-block bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-3">
            PREMIUM
          </span>
        )}
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-lg">
          {review.title}
        </h3>
        {car && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {car.year} {car.make} {car.model}
          </p>
        )}
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{review.rating}/5</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm line-clamp-3">
          {review.content}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {review.pros.slice(0, 2).map((pro, i) => (
            <span key={i} className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
              + {pro}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
