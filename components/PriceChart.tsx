'use client';

import { PriceHistory } from '@/types';
import { formatPrice } from '@/lib/utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface PriceChartProps {
  data: PriceHistory[];
  isPremium?: boolean;
}

export default function PriceChart({ data, isPremium = false }: PriceChartProps) {
  if (!isPremium) {
    return (
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold">Premium Feature</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Upgrade to Pro to view historical price data
            </p>
            <a
              href="/pricing"
              className="inline-block mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Upgrade Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  const chartData = data.map((point) => ({
    date: point.date,
    price: point.price,
    label: new Date(point.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
            interval={7}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
              return `$${value}`;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => [formatPrice(value), 'Price']}
            labelFormatter={(label) => label}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#dc2626"
            strokeWidth={2}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
