import PricingCard from '@/components/PricingCard';
import { subscriptionTiers } from '@/lib/mock-data';

export const metadata = {
  title: 'Pricing - CarCollector',
  description: 'Choose the right plan for your collector car journey',
};

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          From casual enthusiasts to serious collectors, we have a plan that fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
        {subscriptionTiers.map((tier) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            isPopular={tier.name === 'Pro'}
          />
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: 'Can I change my plan later?',
              a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
            },
            {
              q: 'Is there a free trial?',
              a: 'All paid plans come with a 14-day free trial. No credit card required to start.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, Apple Pay, and Google Pay through our secure payment processor.',
            },
            {
              q: 'Can I cancel at any time?',
              a: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.',
            },
          ].map((faq) => (
            <div key={faq.q} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
