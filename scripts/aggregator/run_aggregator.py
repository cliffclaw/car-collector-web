#!/usr/bin/env python3
"""
Main aggregator script - runs all scrapers and stores listings
"""
import os
import sys
import time
import schedule
from datetime import datetime
from loguru import logger

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from autotrader_scraper import AutotraderScraper
from pistonheads_scraper import PistonHeadsScraper
from storage import storage


logger.add("aggregator.log", rotation="10 MB", retention="7 days")


def convert_to_dict(listings: list) -> list:
    """Convert listing objects to dictionaries"""
    result = []
    for listing in listings:
        if listing:
            try:
                result.append(listing.to_dict())
            except:
                pass
    return result


def run_scrapers():
    """Run all scrapers and store results"""
    logger.info("=" * 50)
    logger.info(f"Starting aggregation run at {datetime.now()}")
    logger.info("=" * 50)
    
    all_listings = []
    
    # 1. Autotrader (UK)
    try:
        logger.info("Scraping Autotrader...")
        autotrader = AutotraderScraper()
        listings = autotrader.scrape_listings(max_pages=2)
        all_listings.extend(convert_to_dict(listings))
        logger.info(f"Autotrader: {len(listings)} listings")
    except Exception as e:
        logger.error(f"Autotrader error: {e}")
    
    time.sleep(2)
    
    # 2. PistonHeads (UK)
    try:
        logger.info("Scraping PistonHeads...")
        pistonheads = PistonHeadsScraper()
        listings = pistonheads.scrape_listings(max_pages=2)
        all_listings.extend(convert_to_dict(listings))
        logger.info(f"PistonHeads: {len(listings)} listings")
    except Exception as e:
        logger.error(f"PistonHeads error: {e}")
    
    # Save all to database
    if all_listings:
        saved = storage.save_listings(all_listings)
        logger.info(f"Total saved: {saved}")
    
    logger.info(f"Aggregation complete: {len(all_listings)} total listings")
    return len(all_listings)


def main():
    """Main entry point"""
    logger.info("Car Listing Aggregator Service Started")
    
    # Run once on startup
    count = run_scrapers()
    logger.info(f"Initial run complete: {count} listings")
    
    # Schedule runs every 2 hours
    schedule.every(2).hours.do(run_scrapers)
    
    # Keep running
    while True:
        schedule.run_pending()
        time.sleep(60)


if __name__ == "__main__":
    main()
