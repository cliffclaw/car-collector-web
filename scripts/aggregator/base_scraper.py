"""
Base scraper class for car aggregation service
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import random
import time
from loguru import logger


class CarListing:
    """Represents a single car listing"""
    def __init__(self, source: str, source_url: str, make: str, model: str, price: int,
                 currency: str, country: str, year: int = None, mileage: int = None,
                 fuel_type: str = None, transmission: str = None, colour: str = None,
                 region: str = None, postcode: str = None, external_id: str = None,
                 images: list = None, listed_at: datetime = None):
        self.source = source
        self.source_url = source_url
        self.external_id = external_id
        self.make = make
        self.model = model
        self.year = year
        self.mileage = mileage
        self.fuel_type = fuel_type
        self.transmission = transmission
        self.colour = colour
        self.price = price
        self.currency = currency
        self.price_gbp = price  # Will be calculated
        self.country = country
        self.region = region
        self.postcode = postcode
        self.images = images or []
        self.listed_at = listed_at

    def to_dict(self) -> dict:
        return {
            'source': self.source,
            'source_url': self.source_url,
            'external_id': self.external_id,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'mileage': self.mileage,
            'fuel_type': self.fuel_type,
            'transmission': self.transmission,
            'colour': self.colour,
            'price': self.price,
            'currency': self.currency,
            'price_gbp': self.price_gbp,
            'country': self.country,
            'region': self.region,
            'postcode': self.postcode,
            'images': self.images,
            'listed_at': self.listed_at.isoformat() if self.listed_at else None,
        }


class BaseScraper(ABC):
    """Base class for all car scrapers"""
    
    USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    ]
    
    def __init__(self, source_name: str, country: str):
        self.source_name = source_name
        self.country = country
        self.session = requests.Session()
        
    def get_headers(self) -> dict:
        return {
            'User-Agent': random.choice(self.USER_AGENTS),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-GB,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
    
    def fetch(self, url: str, retries: int = 3) -> Optional[BeautifulSoup]:
        """Fetch a page with retry logic"""
        for attempt in range(retries):
            try:
                response = self.session.get(url, headers=self.get_headers(), timeout=30)
                if response.status_code == 200:
                    return BeautifulSoup(response.text, 'lxml')
                elif response.status_code == 403:
                    logger.warning(f"{self.source_name}: Blocked (403)")
                    time.sleep(random.uniform(10, 30))
            except Exception as e:
                logger.error(f"{self.source_name}: Error: {e}")
                time.sleep(random.uniform(2, 5))
        return None
    
    def rate_limit(self, min_delay: float = 2.0, max_delay: float = 5.0):
        """Apply rate limiting"""
        time.sleep(random.uniform(min_delay, max_delay))
    
    @abstractmethod
    def scrape_listings(self, make: str = None, max_pages: int = 5) -> List[CarListing]:
        """Scrape listings from the source"""
        pass
    
    def normalize_price(self, price: str, currency: str) -> tuple:
        """Normalize price to GBP"""
        import re
        price_num = float(re.sub(r'[^0-9.]', '', price))
        
        gbp_rate = 1.0
        if currency == 'EUR':
            gbp_rate = 0.85
        elif currency == 'USD':
            gbp_rate = 0.79
            
        return int(price_num), int(price_num * gbp_rate)
