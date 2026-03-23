import Link from 'next/link';
import { SubscriptionTier } from '@/types';

interface PricingCardProps {
  tier: SubscriptionTier;
  isPopular?: boolean;
}

export default function PricingCard({ tier, isPopular }: PricingCardProps) {
  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 p-8 ${
        isPopular
          ? 'border-red-600 shadow-xl scale-105'
          : 'border-gray-200 dark:border-gray-700'
      }`}
      data-testid={`pricing-${tier.name.toLowerCase()}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          ${tier.price}
        </span>
        {tier.price > 0 && (
          <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
            <span className="text-gray-600 dark:text-gray-400">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/auth/register"
        className={`block text-center py-3 px-4 rounded-lg font-semibold transition ${
          isPopular
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
        }`}
      >
        {tier.price === 0 ? 'Get Started Free' : 'Subscribe Now'}
      </Link>
    </div>
  );
}
