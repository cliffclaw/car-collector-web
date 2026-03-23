"""
PistonHeads scraper for UK car listings
"""
from typing import List
from base_scraper import BaseScraper, CarListing
from loguru import logger


class PistonHeadsScraper(BaseScraper):
    """Scraper for PistonHeads.co.uk"""
    
    BASE_URL = "https://www.pistonheads.com"
    
    RARE_MAKES = ['porsche', 'ferrari', 'jaguar', 'aston-martin', 'lamborghini',
                  'maserati', 'morgan', 'tvr', 'bentley', 'rolls-royce', 'alfa-romeo']
    
    def __init__(self):
        super().__init__("pistonheads", "UK")
    
    def build_search_url(self, make: str = None, model: str = None, page: int = 1) -> str:
        params = f"sort=price_asc&page={page}"
        if make:
            return f"{self.BASE_URL}/classifieds/used-cars/{make}?{params}"
        return f"{self.BASE_URL}/classifieds?{params}"
    
    def scrape_listings(self, make: str = None, max_pages: int = 3) -> List[CarListing]:
        listings = []
        makes_to_search = [make] if make else self.RARE_MAKES
        
        for make_slug in makes_to_search:
            logger.info(f"Scraping PistonHeads for: {make_slug}")
            
            for page in range(1, max_pages + 1):
                url = self.build_search_url(make=make_slug, page=page)
                soup = self.fetch(url)
                
                if not soup:
                    break
                
                cards = soup.select('.listing-card') or \
                       soup.select('.ph-classified-row') or \
                       soup.select('[data-id]')
                
                for card in cards:
                    listing = self.parse_listing_card(card)
                    if listing:
                        listings.append(listing)
                
                self.rate_limit(2, 5)
        
        logger.info(f"PistonHeads: Found {len(listings)} listings")
        return listings
    
    def parse_listing_card(self, card) -> CarListing:
        try:
            title_elem = card.select_one('h3 a') or card.select_one('.title a')
            href = title_elem.get('href', '') if title_elem else ''
            if href and not href.startswith('http'):
                href = self.BASE_URL + href
            
            title = title_elem.get_text(strip=True) if title_elem else ''
            
            # Extract year and make/model
            parts = title.split(' ', 1)
            year = int(parts[0]) if parts[0].isdigit() else None
            make_model = parts[1] if len(parts) > 1 else title
            make = make_model.split(' ')[0]
            model = ' '.join(make_model.split(' ')[1:])
            
            price_elem = card.select_one('.price')
            price_text = price_elem.get_text(strip=True).replace('£','').replace(',','') if price_elem else '0'
            price = int(price_text) if price_text.isdigit() else 0
            
            return CarListing(
                source='pistonheads',
                source_url=href,
                make=make,
                model=model,
                year=year,
                price=price,
                currency='GBP',
                price_gbp=price,
                country='UK',
                images=[],
                listed_at=None
            )
        except Exception as e:
            logger.debug(f"Error: {e}")
            return None
