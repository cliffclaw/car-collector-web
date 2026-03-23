#!/usr/bin/env python3
"""
Autotrader scraper using Playwright with proper stealth
"""
import asyncio
from playwright.async_api import async_playwright
from loguru import logger
import json
import re


class RealAutotraderScraper:
    """Scrape real listings from Autotrader"""
    
    async def scrape(self, make: str = 'porsche', max_pages: int = 1) -> list:
        """Scrape listings using Playwright with stealth"""
        
        async with async_playwright() as p:
            # Launch with stealth settings
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-sandbox',
                ]
            )
            
            # Create context with realistic settings
            context = await browser.new_context(
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                viewport={'width': 1920, 'height': 1080},
                locale='en-GB',
                timezone_id='Europe/London',
                permissions=['geolocation'],
                geolocation={'latitude': 51.5074, 'longitude': -0.1278},
            )
            
            # Add stealth scripts
            page = await context.new_page()
            
            # Inject webdriver detection bypass
            await page.add_init_script('''
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5]
                });
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-GB', 'en']
                });
                window.navigator.chrome = { runtime: {} };
            ''')
            
            listings = []
            
            for page_num in range(1, max_pages + 1):
                url = f"https://www.autotrader.co.uk/cars?make%5B0%5D={make}&price-from=10000&postcode=sw1a1aa&sort=price-asc&page={page_num}"
                logger.info(f"Loading: {url}")
                
                try:
                    await page.goto(url, timeout=60000, wait_until='networkidle')
                    await page.wait_for_timeout(5000)  # Wait for JS
                    
                    # Get page data after JS execution
                    # Look for __NEXT_DATA__ or similar
                    next_data = await page.evaluate('''() => {
                        const el = document.getElementById('__NEXT_DATA__');
                        return el ? el.textContent : null;
                    }''')
                    
                    if next_data:
                        data = json.loads(next_data)
                        logger.info(f"Found __NEXT_DATA__ with keys: {list(data.get('props', {}).keys())}")
                        
                        # Try to extract listings from props
                        props = data.get('props', {})
                        page_props = props.get('pageProps', {})
                        
                        # Look for search results
                        if 'searchResults' in page_props:
                            results = page_props['searchResults']
                            logger.info(f"Found searchResults!")
                            for r in results[:10]:
                                print(f"  Found: {r}")
                    
                    # Also try getting all text and parsing
                    text = await page.evaluate('document.body.innerText')
                    if 'results' in text.lower():
                        idx = text.lower().find('results')
                        logger.info(f"Results area: {text[max(0,idx-20):idx+40]}")
                        
                except Exception as e:
                    logger.error(f"Error: {e}")
                
                await asyncio.sleep(3)
            
            await browser.close()
        
        return listings


async def main():
    scraper = RealAutotraderScraper()
    await scraper.scrape('porsche', max_pages=1)


if __name__ == "__main__":
    asyncio.run(main())
