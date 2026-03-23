Add car listing aggregation + research system to the Next.js project at /Users/administrator/car-collector-web

## 1. Focus
Only rare/collectible cars (£10k+): Porsche, Ferrari, Morgan, Bugatti, Jaguar, TVR, DeTomaso, Jensen, Aston Martin, Rolls Royce, Bentley, Lamborghini, Maserati, Alfa Romeo

## 2. Database Schema (supabase/schema.sql)
Add these tables:

```sql
-- Aggregated Car Listings (from Autotrader, PistonHeads, CarAndClassic, Mobile.de, AutoScout24)
CREATE TABLE car_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL, -- 'autotrader', 'pistonheads', 'carandclassic', 'mobile_de', 'autoscout24'
  source_url VARCHAR(500) NOT NULL,
  external_id VARCHAR(200),
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER,
  mileage INTEGER,
  fuel_type VARCHAR(50),
  transmission VARCHAR(50),
  colour VARCHAR(50),
  price INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'GBP',
  price_gbp INTEGER,
  country VARCHAR(2) NOT NULL, -- 'UK', 'DE', 'FR', 'NL'
  region VARCHAR(100),
  images TEXT[],
  listed_at TIMESTAMP,
  is_fair_value BOOLEAN,
  price_vs_market_pct NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Research Reports (blog posts)
CREATE TABLE research_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image VARCHAR(500),
  car_make VARCHAR(100),
  car_model VARCHAR(100),
  investment_rating VARCHAR(20), -- 'excellent', 'good', 'moderate'
  rarity_score INTEGER,
  road_registered_uk INTEGER,
  is_premium BOOLEAN DEFAULT true,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Market Data
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  price INTEGER,
  currency VARCHAR(3),
  source VARCHAR(100),
  sale_date DATE
);

-- DVLA Registrations
CREATE TABLE dvla_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make VARCHAR(100),
  model VARCHAR(100),
  registered_uk INTEGER,
  taxed_uk INTEGER,
  sot_uk INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_listings_source ON car_listings(source);
CREATE INDEX idx_listings_country ON car_listings(country);
CREATE INDEX idx_listings_make_model ON car_listings(make, model);
```

## 3. Create lib/mock-listings.ts
Mock listings data showing cars from different sources and countries:
- UK: Autotrader, PistonHeads, CarAndClassic
- EU: Mobile.de, AutoScout24
- Only rare cars (Porsche 911, Ferrari 355, Morgan, Jaguar E-Type, TVR, etc.)
- Include country field and fair value indicators

## 4. Create lib/mock-research.ts
Mock research reports:
- "Porsche 911964: The Investment Opportunity"
- "TVR Tuscan Speed Six: Why Prices Are Soaring"
- "Jaguar E-Type: 50 Years of Price Analysis"
- "UK Road Registrations: How Many Survive?"

## 5. Create Components
- ListingCard.tsx - shows car with source badge, country flag, fair value indicator
- ResearchCard.tsx - blog preview with investment rating badge, premium lock
- CountryBadge.tsx - flag + country name
- DVLACard.tsx - UK registration stats

## 6. Create Pages
- app/listings/page.tsx - aggregated listings with filters (country, make, price)
- app/research/page.tsx - research hub
- app/research/[slug]/page.tsx - individual report (paywalled if premium)
- app/analytics/page.tsx - market analytics

## 7. Update Header
Add "Listings", "Research", "Analytics" to navigation

## 8. Update Types
Add CarListing, ResearchReport, MarketData, DVLADelete types to types/index.ts

## 9. Add to schema.sql
Include new tables in supabase/schema.sql

## 10. Commit frequently:
- "feat: Add car listings aggregation schema and mock data"
- "feat: Add listings page with country filters"
- "feat: Add research reports system"
- "feat: Add analytics page with DVLA data"

After each commit, run: openclaw system event --text "Commit: [message]" --mode now

When finished: openclaw system event --text "Done: Added listings aggregation and research system" --mode now