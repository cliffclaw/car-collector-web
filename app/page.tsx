import Link from 'next/link';
import { cars, reviews } from '@/lib/mock-data';
import CarCard from '@/components/CarCard';
import ReviewCard from '@/components/ReviewCard';
import { TrendingUp, Shield, Users, Star, BarChart3, Crown } from 'lucide-react';

export default function HomePage() {
  const featuredCars = cars.slice(0, 6);
  const latestReviews = reviews.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-sm font-medium mb-6">
              <Star size={14} className="mr-1.5" />
              Trusted by 50,000+ collector car enthusiasts
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              The Ultimate{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Collector Car
              </span>{' '}
              Resource
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl">
              Discover detailed reviews, track real-time market prices, analyze historical
              trends, and connect with fellow enthusiasts. Everything you need to make
              informed decisions about collector cars.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                Browse Cars
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur"
              >
                View Plans
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Cars Listed', value: '2,500+' },
              { label: 'Expert Reviews', value: '1,200+' },
              { label: 'Active Members', value: '50K+' },
              { label: 'Price Data Points', value: '500K+' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Everything You Need for Collector Cars
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From market analysis to community discussion, we provide all the tools serious
              collectors need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: 'Expert Reviews',
                description: 'In-depth reviews from experienced collectors and automotive journalists covering every aspect of ownership.',
              },
              {
                icon: TrendingUp,
                title: 'Market Prices',
                description: 'Real-time market valuations and pricing data from auctions, dealers, and private sales worldwide.',
              },
              {
                icon: BarChart3,
                title: 'Price History',
                description: 'Track historical price trends over decades to identify investment opportunities and market patterns.',
              },
              {
                icon: Users,
                title: 'Community Forums',
                description: 'Connect with fellow enthusiasts, share knowledge, and get advice from experienced collectors.',
              },
              {
                icon: Shield,
                title: 'Verified Data',
                description: 'All pricing data is verified from multiple sources to ensure accuracy and reliability.',
              },
              {
                icon: Crown,
                title: 'Premium Insights',
                description: 'Access exclusive analytics, price predictions, and expert valuation reports with our premium plans.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Cars</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Explore our curated selection of exceptional collector cars
              </p>
            </div>
            <Link
              href="/cars"
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Reviews</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Expert reviews from our community of collectors
              </p>
            </div>
            <Link
              href="/reviews"
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm"
            >
              All Reviews →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ready to Start Collecting?
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of enthusiasts who use CarCollector to make smarter decisions
            about their collector car investments.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-red-600 hover:text-red-600 dark:hover:border-red-400 dark:hover:text-red-400 transition-colors"
            >
              Compare Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
