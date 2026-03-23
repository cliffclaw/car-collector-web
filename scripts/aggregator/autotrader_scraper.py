"""
Autotrader.co.uk scraper for UK car listings
"""
import re
from typing import List, Optional
from datetime import datetime
from bs4 import BeautifulSoup
from base_scraper import BaseScraper, CarListing
from loguru import logger


class AutotraderScraper(BaseScraper):
    """Scraper for Autotrader.co.uk"""
    
    BASE_URL = "https://www.autotrader.co.uk"
    
    # Makes to focus on (rare/collectible)
    RARE_MAKES = ['porsche', 'ferrari', 'jaguar', 'aston-martin', 'lamborghini', 
                  'maserati', 'morgan', 'tvr', 'bentley', 'rolls-royce', 'alfa-romeo']
    
    def __init__(self):
        super().__init__("autotrader", "UK")
    
    def build_search_url(self, make: str = None, model: str = None, 
                         price_min: int = 10000, page: int = 1) -> str:
        """Build search URL with filters"""
        params = [
            f"price-from={price_min}",
            f"page={page}",
            "sorting=price-asc",
            "include-delivery=0",
        ]
        if make:
            params.append(f"make={make}")
        if model:
            params.append(f"model={model}")
        
        return f"{self.BASE_URL}/car-search?{'&'.join(params)}"
    
    def parse_price(self, price_text: str) -> tuple:
        """Parse price from text, return (price, currency)"""
        price_text = price_text.replace(',', '').replace('£', '').strip()
        try:
            price = int(float(price_text))
            return price, 'GBP'
        except:
            return 0, 'GBP'
    
    def parse_mileage(self, mileage_text: str) -> Optional[int]:
        """Parse mileage from text"""
        if not mileage_text:
            return None
        mileage_text = mileage_text.replace(',', '').replace(' miles', '').replace('mile', '').strip()
        try:
            return int(mileage_text)
        except:
            return None
    
    def parse_year(self, year_text: str) -> Optional[int]:
        """Parse year from text"""
        if not year_text:
            return None
        try:
            year = int(year_text)
            if year < 100:
                year = 2000 + year if year < 30 else 1900 + year
            return year
        except:
            return None
    
    def scrape_listings(self, make: str = None, max_pages: int = 3) -> List[CarListing]:
        """Scrape listings from Autotrader"""
        listings = []
        
        makes_to_search = [make] if make else self.RARE_MAKES
        
        for make_slug in makes_to_search:
            logger.info(f"Scraping Autotrader for make: {make_slug}")
            
            for page in range(1, max_pages + 1):
                url = self.build_search_url(make=make_slug, page=page)
                soup = self.fetch(url)
                
                if not soup:
                    break
                
                # Find listing cards
                cards = soup.select('article[data-testid="search-results"]') or \
                        soup.select('.listing-row') or \
                        soup.select('[data-listing-id]')
                
                if not cards:
                    # Try alternative selectors
                    cards = soup.select('.vehicle-details') or \
                           soup.select('.search-result')
                
                for card in cards:
                    try:
                        listing = self.parse_listing_card(card)
                        if listing:
                            listings.append(listing)
                    except Exception as e:
                        logger.debug(f"Error parsing card: {e}")
                
                self.rate_limit(3, 7)
        
        logger.info(f"Autotrader: Found {len(listings)} listings")
        return listings
    
    def parse_listing_card(self, card) -> Optional[CarListing]:
        """Parse a single listing card"""
        try:
            # Try multiple selectors for different layouts
            title_elem = card.select_one('[data-testid="vehicle-title"]') or \
                        card.select_one('.vehicle-title') or \
                        card.select_one('h2 a') or \
                        card.select_one('a[href*="/classified/ad/"]')
            
            if not title_elem:
                return None
            
            # Get title and URL
            title = title_elem.get_text(strip=True)
            href = title_elem.get('href', '')
            if href and not href.startswith('http'):
                href = self.BASE_URL + href
            
            # Extract make/model from title
            # Title format: "2020 Porsche 911 Carrera 4S"
            title_parts = title.split(' ', 1)
            year = self.parse_year(title_parts[0]) if title_parts else None
            make_model = title_parts[1] if len(title_parts) > 1 else title
            
            make_parts = make_model.split(' ', 1)
            make = make_parts[0]
            model = make_parts[1] if len(make_parts) > 1 else ''
            
            # Get price
            price_elem = card.select_one('[data-testid="vehicle-price"]') or \
                        card.select_one('.price') or \
                        card.select_one('[itemprop="price"]')
            price_text = price_elem.get_text(strip=True) if price_elem else '0'
            price, currency = self.parse_price(price_text)
            
            # Get mileage
            mileage_elem = card.select_one('[data-testid="vehicle-miles"]') or \
                          card.select_one('.mileage')
            mileage = self.parse_mileage(mileage_elem.get_text(strip=True)) if mileage_elem else None
            
            # Get location
            location_elem = card.select_one('[data-testid="vehicle-location"]') or \
                           card.select_one('.location') or \
                           card.select_one('.seller-location')
            location = location_elem.get_text(strip=True) if location_elem else None
            
            # Get image
            img_elem = card.select_one('img[src*="autotrader"]') or \
                      card.select_one('img[src*="car"]')
            image_url = img_elem.get('src') if img_elem else None
            
            # Get listing date
            date_elem = card.select_one('.listed-date') or \
                       card.select_one('[data-testid="listing-date"]')
            listed_at = datetime.now()  # Default to now if not found
            
            return CarListing(
                source='autotrader',
                source_url=href,
                make=make,
                model=model,
                year=year,
                mileage=mileage,
                price=price,
                currency=currency,
                price_gbp=price,
                country='UK',
                region=location,
                images=[image_url] if image_url else [],
                listed_at=listed_at
            )
            
        except Exception as e:
            logger.debug(f"Error parsing listing: {e}")
            return None


if __name__ == "__main__":
    scraper = AutotraderScraper()
    listings = scraper.scrape_listings(max_pages=2)
    print(f"Found {len(listings)} listings")
    for l in listings[:5]:
        print(f"  {l.year} {l.make} {l.model} - £{l.price:,}")
