# Car Listing Aggregator Service

Real-time car listing aggregation from multiple sources.

## Features
- Scrapes Autotrader, PistonHeads, Car & Classic (UK)
- Scrapes Mobile.de, AutoScout24 (EU)
- Stores to Supabase database
- Runs on cron (configurable interval)

## Setup

```bash
cd scripts/aggregator
pip install -r requirements.txt

# Set environment variables
export SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_KEY="your_service_key"

# Run manually
python run_aggregator.py

# Or run as service
python run_aggregator.py &  # Runs continuously with cron
```

## Scraper Status
- [x] Autotrader UK - Working
- [x] PistonHeads UK - Working
- [ ] Car & Classic - TODO
- [ ] Mobile.de - TODO
- [ ] AutoScout24 - TODO

## Notes
- Uses rotating User-Agent to avoid blocking
- Respects rate limits between requests
- Deduplicates by source_url
- Converts EUR to GBP pricing
