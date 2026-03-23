-- CarCollector Database Schema
-- PostgreSQL / Supabase

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Users
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'collector')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ============================================================
-- Cars
-- ============================================================
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC(15, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('classic', 'muscle', 'exotic', 'luxury', 'sports')),
  description TEXT,
  engine TEXT,
  horsepower INTEGER,
  torque TEXT,
  transmission TEXT,
  drivetrain TEXT,
  weight TEXT,
  zero_to_sixty TEXT,
  top_speed TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cars_category ON cars(category);
CREATE INDEX idx_cars_make ON cars(make);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_price ON cars(price);

-- ============================================================
-- Reviews
-- ============================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_car_id ON reviews(car_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================
-- Price History
-- ============================================================
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  price NUMERIC(15, 2) NOT NULL,
  date DATE NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_price_history_car_id ON price_history(car_id);
CREATE INDEX idx_price_history_date ON price_history(date);
CREATE INDEX idx_price_history_car_date ON price_history(car_id, date);

-- ============================================================
-- Saved Cars
-- ============================================================
CREATE TABLE saved_cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

CREATE INDEX idx_saved_cars_user_id ON saved_cars(user_id);

-- ============================================================
-- Forum Categories
-- ============================================================
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '💬',
  thread_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_forum_categories_slug ON forum_categories(slug);

-- ============================================================
-- Forum Threads
-- ============================================================
CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  reply_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_forum_threads_category_id ON forum_threads(category_id);
CREATE INDEX idx_forum_threads_user_id ON forum_threads(user_id);
CREATE INDEX idx_forum_threads_created_at ON forum_threads(created_at);

-- ============================================================
-- Forum Posts (Replies)
-- ============================================================
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_forum_posts_thread_id ON forum_posts(thread_id);
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);

-- ============================================================
-- Subscriptions
-- ============================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'collector')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

-- ============================================================
-- Row Level Security Policies
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read access for cars, categories, threads
CREATE POLICY "Cars are viewable by everyone" ON cars FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by everyone" ON forum_categories FOR SELECT USING (true);
CREATE POLICY "Threads are viewable by everyone" ON forum_threads FOR SELECT USING (true);
CREATE POLICY "Posts are viewable by everyone" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Price history is viewable by everyone" ON price_history FOR SELECT USING (true);

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own saved cars
CREATE POLICY "Users can view own saved cars" ON saved_cars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save cars" ON saved_cars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave cars" ON saved_cars FOR DELETE USING (auth.uid() = user_id);

-- Users can manage their own reviews
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Users can create threads and posts
CREATE POLICY "Users can create threads" ON forum_threads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own threads" ON forum_threads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON forum_posts FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON forum_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-increment thread count on new thread
CREATE OR REPLACE FUNCTION increment_thread_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_categories SET thread_count = thread_count + 1 WHERE id = NEW.category_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_thread_count_trigger AFTER INSERT ON forum_threads FOR EACH ROW EXECUTE FUNCTION increment_thread_count();

-- Auto-increment reply count on new post
CREATE OR REPLACE FUNCTION increment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_threads SET reply_count = reply_count + 1 WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_reply_count_trigger AFTER INSERT ON forum_posts FOR EACH ROW EXECUTE FUNCTION increment_reply_count();

-- ============================================================
-- Car Listings (Aggregated from multiple sources)
-- ============================================================
CREATE TABLE car_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL,
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
  country VARCHAR(2) NOT NULL,
  region VARCHAR(100),
  images TEXT[],
  listed_at TIMESTAMP,
  is_fair_value BOOLEAN,
  price_vs_market_pct NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_listings_source ON car_listings(source);
CREATE INDEX idx_listings_country ON car_listings(country);
CREATE INDEX idx_listings_make_model ON car_listings(make, model);

-- ============================================================
-- Research Reports
-- ============================================================
CREATE TABLE research_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image VARCHAR(500),
  car_make VARCHAR(100),
  car_model VARCHAR(100),
  investment_rating VARCHAR(20),
  rarity_score INTEGER,
  road_registered_uk INTEGER,
  is_premium BOOLEAN DEFAULT true,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Market Data
-- ============================================================
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

-- ============================================================
-- DVLA Registrations
-- ============================================================
CREATE TABLE dvla_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make VARCHAR(100),
  model VARCHAR(100),
  registered_uk INTEGER,
  taxed_uk INTEGER,
  sot_uk INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS for new tables
ALTER TABLE car_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE dvla_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Car listings are viewable by everyone" ON car_listings FOR SELECT USING (true);
CREATE POLICY "Research reports are viewable by everyone" ON research_reports FOR SELECT USING (true);
CREATE POLICY "Market data is viewable by everyone" ON market_data FOR SELECT USING (true);
CREATE POLICY "DVLA data is viewable by everyone" ON dvla_data FOR SELECT USING (true);
