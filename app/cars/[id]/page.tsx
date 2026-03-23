import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cars, reviews } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = cars.find((c) => c.id === id);

  if (!car) {
    notFound();
  }

  const carReviews = reviews.filter((r) => r.car_id === car.id);

  const categoryColors: Record<string, string> = {
    classic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    muscle: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    exotic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    luxury: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    sports: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/cars" className="text-red-600 hover:text-red-700">Cars</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600 dark:text-gray-400">{car.year} {car.make} {car.model}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Car Image */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl aspect-video flex items-center justify-center mb-6">
            <span className="text-8xl">🏎️</span>
          </div>

          {/* Title & Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[car.category]}`}>
                {car.category}
              </span>
              {car.is_premium && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  Premium
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="car-title">
              {car.year} {car.make} {car.model}
            </h1>
            <p className="text-3xl font-bold text-red-600 mt-2" data-testid="car-price">
              {formatPrice(car.price)}
            </p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{car.description}</p>
          </div>

          {/* Price History Link */}
          <div className="mb-8">
            <Link
              href={`/cars/${car.id}/prices`}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-medium transition"
            >
              📈 View Price History
            </Link>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Reviews ({carReviews.length})
            </h2>
            {carReviews.length > 0 ? (
              <div className="space-y-4">
                {carReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 dark:text-white">{review.title}</h3>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{review.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {review.pros.map((pro) => (
                        <span key={pro} className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded">
                          ✓ {pro}
                        </span>
                      ))}
                      {review.cons.map((con) => (
                        <span key={con} className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded">
                          ✗ {con}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No reviews yet for this car.</p>
            )}
          </div>
        </div>

        {/* Sidebar - Specs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Specifications</h2>
            <dl className="space-y-3" data-testid="car-specs">
              {[
                ['Engine', car.specs.engine],
                ['Horsepower', `${car.specs.horsepower} hp`],
                ['Torque', car.specs.torque],
                ['Transmission', car.specs.transmission],
                ['Drivetrain', car.specs.drivetrain],
                ['Weight', car.specs.weight],
                ['0-60 mph', car.specs.zero_to_sixty],
                ['Top Speed', car.specs.top_speed],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
