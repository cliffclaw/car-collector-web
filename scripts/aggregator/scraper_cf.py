#!/usr/bin/env python3
"""
Autotrader scraper using curl_cffi
"""
from curl_cffi.requests import Session
from bs4 import BeautifulSoup
import re
import json
from typing import List, Dict
from loguru import logger


class AutotraderCFFI:
    """Scrape Autotrader using curl_cffi"""
    
    def __init__(self):
        self.session = Session(impersonate='chrome')
        
    def scrape(self, make: str, max_pages: int = 2) -> List[Dict]:
        all_listings = []
        
        for page in range(1, max_pages + 1):
            logger.info(f"Scraping {make} page {page}")
            
            # Use URL format that works
            url = f"https://www.autotrader.co.uk/cars?make%5B0%5D={make}&price-from=10000&postcode=sw1a1aa&sort=price-asc&page={page}"
            
            try:
                resp = self.session.get(url, timeout=30, allow_redirects=True)
                
                if resp.status_code != 200:
                    logger.error(f"HTTP {resp.status_code}")
                    continue
                
                # Parse page
                soup = BeautifulSoup(resp.text, 'lxml')
                
                # Look for listings in script tags with JSON data
                scripts = soup.find_all('script')
                for script in scripts:
                    text = script.string or ''
                    
                    # Look for any JSON with car data
                    if '"listing"' in text.lower() or '"vehicle"' in text.lower():
                        try:
                            # Find JSON objects
                            matches = re.findall(r'\{[^{}]*"price"[^{}]*\}', text)
                            for m in matches:
                                try:
                                    data = json.loads(m)
                                    listing = self._parse_listing_data(data, make)
                                    if listing:
                                        all_listings.append(listing)
                                except:
                                    pass
                        except:
                            pass
                
                logger.info(f"Page {page}: Found {len(all_listings)} listings")
                
            except Exception as e:
                logger.error(f"Error: {e}")
                
        return all_listings
    
    def _parse_listing_data(self, data: Dict, make: str) -> Dict:
        """Parse listing from JSON data"""
        try:
            price = data.get('price') or data.get('priceAmount')
            if not price:
                return None
                
            return {
                'source': 'autotrader',
                'source_url': data.get('url', 'https://www.autotrader.co.uk'),
                'make': make.title(),
                'model': data.get('model', data.get('title', '')).title(),
                'year': data.get('year') or data.get('registrationYear'),
                'mileage': data.get('mileage') or data.get('miles'),
                'price': int(price),
                'currency': 'GBP',
                'price_gbp': int(price),
                'country': 'UK',
                'images': [data.get('image')] if data.get('image') else [],
            }
        except:
            return None


if __name__ == "__main__":
    scraper = AutotraderCFFI()
    listings = scraper.scrape('porsche', max_pages=1)
    print(f"Found {len(listings)} listings")
    for l in listings[:5]:
        print(f"  {l.get('make')} {l.get('model')} - £{l.get('price')}")
