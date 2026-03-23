import { CarListing } from '@/types';
import { realListings } from './real-listings';

const countryFlags: Record<string, string> = {
  UK: '🇬🇧',
  DE: '🇩🇪',
  FR: '🇫🇷',
  NL: '🇳🇱',
};

const sourceNames: Record<string, string> = {
  autotrader: 'AutoTrader',
  pistonheads: 'PistonHeads',
  carandclassic: 'Car & Classic',
  mobile_de: 'Mobile.de',
  autoscout24: 'AutoScout24',
};

// Use real scraped data from Car and Classic
export const carListings: CarListing[] = realListings;

export const getCountryFlag = (country: string): string => countryFlags[country] || '🌍';
export const getSourceName = (source: string): string => sourceNames[source] || source;

export const filterListings = (
  listings: CarListing[],
  filters: {
    country?: string;
    make?: string;
    minPrice?: number;
    maxPrice?: number;
    source?: string;
  }
): CarListing[] => {
  return listings.filter((listing) => {
    if (filters.country && listing.country !== filters.country) return false;
    if (filters.make && !listing.make.toLowerCase().includes(filters.make.toLowerCase())) return false;
    if (filters.minPrice && listing.price_gbp < filters.minPrice) return false;
    if (filters.maxPrice && listing.price_gbp > filters.maxPrice) return false;
    if (filters.source && listing.source !== filters.source) return false;
    return true;
  });
};
