#!/usr/bin/env python3
"""
Autotrader scraper - extracts real car listings
"""
import asyncio
import re
from datetime import datetime
from typing import List
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from loguru import logger


class AutotraderScraper:
    """Scrape real listings from Autotrader UK"""
    
    USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
    POSTCODE = 'sw1a1aa'  # Central London
    
    def __init__(self):
        self.browser = None
    
    async def scrape(self, make: str = 'porsche', max_pages: int = 3) -> List[dict]:
        """Scrape listings from Autotrader"""
        all_listings = []
        
        async with async_playwright() as p:
            self.browser = await p.chromium.launch(headless=True)
            
            for page_num in range(1, max_pages + 1):
                url = f"https://www.autotrader.co.uk/car-search?make={make}&price-from=10000&postcode={self.POSTCODE}&sort=price-asc&page={page_num}"
                logger.info(f"Scraping page {page_num}: {make}")
                
                try:
                    page = await self.browser.new_page()
                    await page.goto(url, timeout=60000)
                    await page.wait_for_load_state('networkidle', timeout=30000)
                    await page.wait_for_timeout(8000)  # Wait for JS render
                    
                    # Get page text and parse
                    text = await page.evaluate('document.body.innerText')
                    content = await page.content()
                    
                    # Extract listings from text
                    page_listings = self._parse_text(text, make)
                    all_listings.extend(page_listings)
                    
                    logger.info(f"Page {page_num}: Found {len(page_listings)} listings")
                    
                except Exception as e:
                    logger.error(f"Error on page {page_num}: {e}")
                
                await page.close()
                await asyncio.sleep(3)  # Rate limit
            
            await self.browser.close()
        
        logger.info(f"Total: {len(all_listings)} listings for {make}")
        return all_listings
    
    def _parse_text(self, text: str, make: str) -> List[dict]:
        """Parse listings from page text"""
        listings = []
        lines = text.split('\n')
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            # Look for lines with price (e.g., "£52,693" or "£12,990")
            price_match = re.search(r'£([\d,]+)', line)
            if price_match and 'miles' in ' '.join(lines[i:i+5]):
                try:
                    # Get price
                    price = int(price_match.group(1).replace(',', ''))
                    
                    # Look backwards for car details
                    context = ' '.join(lines[max(0, i-10):i+10])
                    
                    # Extract year (4 digit year like 2024, 2023, etc.)
                    year_match = re.search(r'\b(19[7-9]\d|20[0-2]\d)\b', context)
                    year = int(year_match.group(1)) if year_match else None
                    
                    # Extract mileage
                    miles_match = re.search(r'([\d,]+)\s*miles', context)
                    mileage = int(miles_match.group(1).replace(',', '')) if miles_match else None
                    
                    # Extract model - look for make and model
                    model = make.title()  # Default to make
                    for model_name in ['Macan', 'Boxster', 'Cayenne', '911', 'Taycan', 'Panamera', 'Carrera', 'Spyder', 'GT3', 'GT4']:
                        if model_name.lower() in context.lower():
                            model = model_name
                            break
                    
                    # Try to find listing URL
                    source_url = f"https://www.autotrader.co.uk/classified/search?make={make}"
                    
                    listing = {
                        'source': 'autotrader',
                        'source_url': source_url,
                        'make': make.title(),
                        'model': model,
                        'year': year,
                        'mileage': mileage,
                        'price': price,
                        'currency': 'GBP',
                        'price_gbp': price,
                        'country': 'UK',
                        'images': [],
                        'listed_at': datetime.now().isoformat(),
                    }
                    
                    # Only add valid listings
                    if price >= 10000:
                        listings.append(listing)
                        
                except Exception as e:
                    logger.debug(f"Parse error: {e}")
            
            i += 1
        
        return listings


async def main():
    """Test scraper"""
    scraper = AutotraderScraper()
    
    for make in ['porsche', 'ferrari', 'jaguar', 'tvr']:
        listings = await scraper.scrape(make=make, max_pages=1)
        print(f"{make.title()}: {len(listings)} listings")
        for l in listings[:3]:
            print(f"  {l['year']} {l['make']} {l['model']} - £{l['price']:,}")


if __name__ == "__main__":
    asyncio.run(main())
