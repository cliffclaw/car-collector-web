#!/usr/bin/env python3
"""
Playwright-based scraper for JavaScript-rendered sites
"""
import asyncio
import os
import re
from datetime import datetime
from typing import List
from playwright.async_api import async_playwright
from loguru import logger

os.environ.setdefault('PYTHONPATH', '.')


class PlaywrightScraper:
    """Scraper using Playwright for JavaScript-rendered sites"""
    
    USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    ]
    
    # UK postcode for searches
    DEFAULT_POSTCODE = 'sw1a1aa'
    
    def __init__(self):
        self.browser = None
    
    async def scrape_autotrader(self, make: str = 'porsche', max_pages: int = 2) -> List[dict]:
        """Scrape Autotrader using Playwright"""
        listings = []
        
        async with async_playwright() as p:
            self.browser = await p.chromium.launch(headless=True)
            context = await self.browser.new_context(
                user_agent=self.USER_AGENTS[0]
            )
            
            for page_num in range(1, max_pages + 1):
                # Autotrader requires postcode parameter
                url = f"https://www.autotrader.co.uk/car-search?make={make}&price-from=10000&postcode={self.DEFAULT_POSTCODE}&sort=price-asc&page={page_num}"
                logger.info(f"Scraping: {url}")
                
                page = await context.new_page()
                await page.goto(url, wait_until='networkidle', timeout=30000)
                await page.wait_for_timeout(3000)
                
                # Get page content
                content = await page.content()
                await page.close()
                
                # Parse with BeautifulSoup
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(content, 'lxml')
                
                # Find all listing links
                links = soup.find_all('a', href=re.compile(r'/classified/ad/\d+'))
                logger.info(f"Page {page_num}: Found {len(links)} listing links")
                
                for link in links:
                    try:
                        href = link.get('href', '')
                        full_url = f"https://www.autotrader.coUK{href}" if href.startswith('/') else href
                        
                        # Extract listing ID
                        match = re.search(r'/ad/(\d+)', href)
                        external_id = match.group(1) if match else None
                        
                        # Get parent article or container
                        article = link.find_parent('article')
                        if not article:
                            continue
                        
                        # Get title - find h2, h3, or similar
                        title_elem = article.find(['h2', 'h3', 'h4'], string=True)
                        if not title_elem:
                            title_elem = article.select_one('[class*="title"]') or article.select_one('[class*="name"]')
                        
                        title = title_elem.get_text(strip=True) if title_elem else ''
                        
                        # Extract year and make/model
                        year = None
                        if re.match(r'^\d{4}', title):
                            year = int(re.match(r'^(\d{4})', title).group(1))
                            make_model = title[4:].strip()
                        else:
                            make_model = title
                        
                        make_parts = make_model.split(' ', 1)
                        car_make = make  # Use search make as default
                        car_model = make_parts[1] if len(make_parts) > 1 else make_model
                        
                        # Get price
                        price_elem = article.select_one('[class*="price"]') or article.select_one('span', string=re.compile(r'£'))
                        price_text = price_elem.get_text(strip=True) if price_elem else '0'
                        price_match = re.search(r'£?([\d,]+)', price_text)
                        price = int(price_match.group(1).replace(',', '')) if price_match else 0
                        
                        # Get mileage
                        miles_elem = article.select_one(string=re.compile(r'\d+,\d+ miles'))
                        mileage = None
                        if miles_elem:
                            miles_match = re.search(r'([\d,]+)\s*miles', miles_elem)
                            mileage = int(miles_match.group(1).replace(',', '')) if miles_match else None
                        
                        # Get image
                        img = article.select_one('img')
                        image_url = None
                        if img:
                            image_url = img.get('src') or img.get('data-src')
                        
                        listing = {
                            'source': 'autotrader',
                            'source_url': full_url,
                            'external_id': external_id,
                            'make': car_make,
                            'model': car_model,
                            'year': year,
                            'mileage': mileage,
                            'price': price,
                            'currency': 'GBP',
                            'price_gbp': price,
                            'country': 'UK',
                            'images': [image_url] if image_url else [],
                            'listed_at': datetime.now().isoformat(),
                        }
                        
                        # Only add valid listings
                        if price > 0:
                            listings.append(listing)
                            
                    except Exception as e:
                        logger.debug(f"Error parsing: {e}")
                
                await asyncio.sleep(2)  # Rate limit
            
            await context.close()
        
        logger.info(f"Autotrader: Got {len(listings)} listings")
        return listings


async def main():
    scraper = PlaywrightScraper()
    listings = await scraper.scrape_autotrader(make='porsche', max_pages=1)
    print(f"\nFound {len(listings)} Porsche listings:")
    for l in listings[:10]:
        print(f"  {l.get('year')} {l.get('make')} {l.get('model')} - £{l.get('price'):,}")


if __name__ == "__main__":
    asyncio.run(main())
