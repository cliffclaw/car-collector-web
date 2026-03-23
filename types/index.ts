export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image_url: string;
  category: 'classic' | 'muscle' | 'exotic' | 'luxury' | 'sports';
  description: string;
  specs: CarSpecs;
  is_premium: boolean;
  created_at: string;
}

export interface CarSpecs {
  engine: string;
  horsepower: number;
  torque: string;
  transmission: string;
  drivetrain: string;
  weight: string;
  zero_to_sixty: string;
  top_speed: string;
}

export interface CarReview {
  id: string;
  car_id: string;
  user_id: string;
  title: string;
  content: string;
  rating: number;
  pros: string[];
  cons: string[];
  is_premium: boolean;
  created_at: string;
  user?: UserProfile;
  car?: Car;
}

export interface PriceHistory {
  id: string;
  car_id: string;
  price: number;
  date: string;
  source: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  subscription_tier: 'free' | 'pro' | 'collector';
  saved_cars: string[];
  created_at: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  thread_count: number;
  icon: string;
}

export interface ForumThread {
  id: string;
  category_id: string;
  user_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  category?: ForumCategory;
}

export interface ForumReply {
  id: string;
  thread_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  stripe_price_id: string;
}
