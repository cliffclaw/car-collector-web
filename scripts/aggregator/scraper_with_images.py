#!/usr/bin/env python3
"""
Car and Classic scraper WITH images
"""
from curl_cffi.requests import Session
from bs4 import BeautifulSoup
import re
from typing import List, Dict
import json
from loguru import logger


class CarAndClassicScraperWithImages:
    """Scrape car listings from Car and Classic with images"""
    
    BASE_URL = 'https://www.carandclassic.com'
    MAKES = ['porsche', 'ferrari', 'jaguar', 'tvr', 'morgan', 'aston-martin', 'maserati']
    
    def __init__(self):
        self.session = Session(impersonate='chrome')
    
    def scrape(self, make: str = None, max_pages: int = 1) -> List[Dict]:
        listings = []
        makes = [make] if make else self.MAKES
        
        for make in makes:
            logger.info(f"Scraping {make}...")
            
            url = f"{self.BASE_URL}/search?make={make}"
            
            try:
                resp = self.session.get(url, timeout=30)
                if resp.status_code != 200:
                    continue
                
                soup = BeautifulSoup(resp.text, 'lxml')
                car_links = soup.find_all('a', href=re.compile(r'/car/C\d+'))
                unique_links = list(set([l.get('href') for l in car_links]))
                
                logger.info(f"Found {len(unique_links)} listings for {make}")
                
                for link in unique_links[:20]:
                    listing = self.get_listing_details(link, make)
                    if listing:
                        listings.append(listing)
                    
                    import time
                    time.sleep(0.5)
                    
            except Exception as e:
                logger.error(f"Error: {e}")
        
        return listings
    
    def get_listing_details(self, path: str, make: str) -> Dict:
        try:
            url = self.BASE_URL + path
            resp = self.session.get(url, timeout=30)
            
            if resp.status_code != 200:
                return None
            
            soup = BeautifulSoup(resp.text, 'lxml')
            text = soup.get_text()
            
            # Get price
            price_match = re.search(r'£([\d,]+)', text)
            price = int(price_match.group(1).replace(',', '')) if price_match else 0
            
            # Get year
            year_match = re.search(r'(19[789]\d|20[012]\d)', text)
            year = int(year_match.group(1)) if year_match else None
            
            # Get mileage
            miles_match = re.search(r'([\d,]+)\s*miles', text)
            mileage = int(miles_match.group(1).replace(',', '')) if miles_match else None
            
            # Get model from GTM
            model = make.title()
            gtm = soup.find('script', string=re.compile('dataLayer'))
            if gtm:
                gtm_text = gtm.string or ''
                model_match = re.search(r'"model":"([^"]+)"', gtm_text)
                if model_match:
                    model = model_match.group(1)
            
            # Get images - multiple sources
            images = []
            
            # 1. OG image
            og_image = soup.find('meta', property='og:image')
            if og_image:
                img_url = og_image.get('content', '').split('?')[0]  # Remove query params
                if img_url:
                    images.append(img_url)
            
            # 2. Gallery images from HTML
            img_matches = re.findall(
                r'https://assets\.carandclassic\.com/uploads/new/\d+/[^\"\'\s]+\.jpg',
                resp.text
            )
            # Clean and add unique images
            for img in img_matches:
                clean_img = img.split('?')[0]
                if clean_img not in images:
                    images.append(clean_img)
            
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
                'images': images[:5],  # Max 5 images
            }
            
        except Exception as e:
            logger.debug(f"Error: {e}")
            return None


if __name__ == "__main__":
    import uuid
    from datetime import datetime
    
    scraper = CarAndClassicScraperWithImages()
    listings = scraper.scrape('porsche', max_pages=1)
    
    print(f"Found {len(listings)} Porsche listings WITH IMAGES:")
    for l in listings[:5]:
        img_count = len(l.get('images', []))
        print(f"  {l['year']} {l['make']} {l['model']} - £{l['price']:,}")
        print(f"    Images: {img_count}")
        if l.get('images'):
            print(f"    Main: {l['images'][0][:60]}...")
