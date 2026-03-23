"""
Storage module for saving scraped listings to Supabase
"""
import os
from typing import List
from datetime import datetime
from supabase import create_client, Client
from loguru import logger


class ListingStorage:
    """Handle storage of listings to database"""
    
    def __init__(self):
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_SERVICE_KEY')
        
        if not supabase_url or not supabase_key:
            logger.warning("Supabase credentials not configured - using local storage")
            self.client = None
            self.local_storage = []
        else:
            self.client: Client = create_client(supabase_url, supabase_key)
            self.local_storage = []
    
    def save_listings(self, listings: List[dict]) -> int:
        """Save listings to database"""
        if not self.client:
            self.local_storage.extend(listings)
            logger.info(f"Stored {len(listings)} listings locally (total: {len(self.local_storage)})")
            return len(listings)
        
        saved = 0
        for listing in listings:
            try:
                # Check if listing exists
                existing = self.client.table('car_listings').select('id').eq('source_url', listing['source_url']).execute()
                
                if existing.data:
                    # Update existing
                    self.client.table('car_listings').update({
                        'price': listing['price'],
                        'price_gbp': listing.get('price_gbp'),
                        'mileage': listing.get('mileage'),
                        'updated_at': datetime.now().isoformat()
                    }).eq('source_url', listing['source_url']).execute()
                else:
                    # Insert new
                    listing['created_at'] = datetime.now().isoformat()
                    self.client.table('car_listings').insert(listing).execute()
                
                saved += 1
                
            except Exception as e:
                logger.error(f"Error saving listing: {e}")
        
        logger.info(f"Saved {saved} listings to database")
        return saved
    
    def mark_expired(self, source: str, older_than_hours: int = 24):
        """Mark listings as expired if not updated recently"""
        if not self.client:
            return
        
        try:
            cutoff = datetime.now()
            self.client.table('car_listings').update({
                'is_active': False
            }).eq('source', source).lt('updated_at', cutoff.isoformat()).execute()
        except Exception as e:
            logger.error(f"Error marking expired: {e}")
    
    def get_listings(self, source: str = None, make: str = None, 
                     country: str = None, limit: int = 100) -> List[dict]:
        """Retrieve listings from database"""
        if not self.client:
            return self.local_storage[-limit:]
        
        query = self.client.table('car_listings').select('*').eq('is_active', True)
        
        if source:
            query = query.eq('source', source)
        if make:
            query = query.ilike('make', f'%{make}%')
        if country:
            query = query.eq('country', country)
        
        result = query.limit(limit).execute()
        return result.data


# Singleton instance
storage = ListingStorage()
