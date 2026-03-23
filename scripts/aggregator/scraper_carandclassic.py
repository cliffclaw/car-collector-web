#!/usr/bin/env python3
"""
Car and Classic scraper - works!
"""
from curl_cffi.requests import Session
from bs4 import BeautifulSoup
import re
from typing import List, Dict
from loguru import logger


class CarAndClassicScraper:
    """Scrape car listings from Car and Classic"""
    
    BASE_URL = 'https://www.carandclassic.com'
    
    # Rare/collectible makes
    MAKES = ['porsche', 'ferrari', 'jaguar', 'aston-martin', 'lamborghini',
             'maserati', 'morgan', 'tvr', 'bentley', 'rolls-royce', 'alfa-romeo', 'jensen']
    
    def __init__(self):
        self.session = Session(impersonate='chrome')
    
    def scrape(self, make: str = None, max_pages: int = 3) -> List[Dict]:
        """Scrape listings for a make"""
        listings = []
        makes = [make] if make else self.MAKES
        
        for make in makes:
            logger.info(f"Scraping Car and Classic for: {make}")
            
            # Get search results page
            url = f"{self.BASE_URL}/search?make={make}"
            
            try:
                resp = self.session.get(url, timeout=30)
                if resp.status_code != 200:
                    logger.error(f"HTTP {resp.status_code}")
                    continue
                
                soup = BeautifulSoup(resp.text, 'lxml')
                
                # Get all car links
                car_links = soup.find_all('a', href=re.compile(r'/car/C\d+'))
                unique_links = list(set([l.get('href') for l in car_links]))
                
                logger.info(f"Found {len(unique_links)} listings for {make}")
                
                # Get details for each listing
                for i, link in enumerate(unique_links[:20]):  # Limit to 20 per make
                    listing = self.get_listing_details(link, make)
                    if listing:
                        listings.append(listing)
                    
                    # Rate limit
                    import time
                    time.sleep(0.5)
                    
            except Exception as e:
                logger.error(f"Error scraping {make}: {e}")
        
        logger.info(f"Total: {len(listings)} listings")
        return listings
    
    def get_listing_details(self, path: str, make: str) -> Dict:
        """Get details for a single listing"""
        try:
            url = self.BASE_URL + path
            resp = self.session.get(url, timeout=30)
            
            if resp.status_code != 200:
                return None
            
            soup = BeautifulSoup(resp.text, 'lxml')
            text = soup.get_text()
            
            # Get price from text
            price_match = re.search(r'£([\d,]+)', text)
            price = int(price_match.group(1).replace(',', '')) if price_match else 0
            
            # Get year
            year_match = re.search(r'(19[789]\d|20[012]\d)', text)
            year = int(year_match.group(1)) if year_match else None
            
            # Get mileage
            miles_match = re.search(r'([\d,]+)\s*miles', text)
            mileage = int(miles_match.group(1).replace(',', '')) if miles_match else None
            
            # Try to get model from GTM data
            model = make.title()
            gtm = soup.find('script', string=re.compile('dataLayer'))
            if gtm:
                gtm_text = gtm.string or ''
                model_match = re.search(r'"model":"([^"]+)"', gtm_text)
                if model_match:
                    model = model_match.group(1)
            
            # Get image
            img = soup.find('img', {'data-testid': 'hero-image'} or {'class': re.compile('image')})
            image_url = None
            if img:
                image_url = img.get('src') or img.get('data-src')
            
            return {
                'source': 'carandclassic',
                'source_url': url,
                'make': make.title(),
                'model': model,
                'year': year,
                'mileage': mileage,
                'price': price,
                'currency': 'GBP',
                'price_gbp': price,
                'country': 'UK',
                'images': [image_url] if image_url else [],
            }
            
        except Exception as e:
            logger.debug(f"Error getting details: {e}")
            return None


if __name__ == "__main__":
    scraper = CarAndClassicScraper()
    
    # Test with one make
    listings = scraper.scrape('porsche', max_pages=1)
    
    print(f"\\nFound {len(listings)} Porsche listings:")
    for l in listings[:10]:
        year = l.get('year', 'N/A')
        miles = f"{l.get('mileage'):,}" if l.get('mileage') else 'N/A'
        print(f"  {year} {l['make']} {l['model']} - £{l['price']:,} - {miles} miles")
