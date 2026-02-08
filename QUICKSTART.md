# GTM Dashboard - Quick Start Guide

## 🚀 Getting Started with Live Data

Your GTM Dashboard is now ready to connect to live Databricks data! Here's how to get it running:

### Step 1: Set Up Your Environment

```bash
# Set your Databricks credentials as environment variables
export DATABRICKS_TOKEN="YOUR_TOKEN_HERE"
export DATABRICKS_URL="https://adb-5769108933149883.3.azuredatabricks.net"
export DATABRICKS_WAREHOUSE_ID="aebcaaff2f9457a3"
```

**Or** create a `.env` file (automatically ignored by git):
```bash
DATABRICKS_TOKEN=YOUR_TOKEN_HERE
DATABRICKS_URL=https://adb-5769108933149883.3.azuredatabricks.net
DATABRICKS_WAREHOUSE_ID=aebcaaff2f9457a3
```

### Step 2: Fetch Live Data

```bash
# Run the data fetcher script
node fetch-gtm-data.js
```

This will:
- ✅ Connect to your Databricks warehouse
- ✅ Fetch MQLs, Pipeline, and Signed Deals data for 2025
- ✅ Transform and aggregate the data
- ✅ Save JSON files to `assets/data/` directory

Expected output:
```
================================================================================
📊 Fetching GTM Data from Databricks
================================================================================

🔍 Fetching MQLs data...
✅ Fetching MQLs data - Success (XXX rows)

🔍 Fetching Pipeline data...
✅ Fetching Pipeline data - Success (XXX rows)

🔍 Fetching Signed Deals data...
✅ Fetching Signed Deals data - Success (XXX rows)

📈 Data Summary:
  - MQLs: XXX rows
  - Pipeline: XXX rows
  - Signed Deals: XXX rows

🔄 Transforming data...

💾 Saving data files...
✅ Data saved to ./assets/data/
   - gtm-data-raw.json (XXX total rows)
   - gtm-data-transformed.json (XXX aggregated rows)

✨ Done! You can now use this data in your dashboard.
```

### Step 3: View the Dashboard

Open `gtm-dashboard.html` in your browser:

```bash
# Option 1: Using Python
python -m http.server 8000
# Then open: http://localhost:8000/gtm-dashboard.html

# Option 2: Using Node.js
npx http-server
# Then open: http://localhost:8080/gtm-dashboard.html

# Option 3: Direct file access (may have CORS issues)
open gtm-dashboard.html
```

## 📊 Understanding the Data Files

### `gtm-data-raw.json`
Contains the raw data from Databricks with all original columns:
- `mqls[]` - Raw MQL records
- `pipeline[]` - Raw pipeline records
- `signedDeals[]` - Raw signed deals records
- `fetchedAt` - Timestamp when data was fetched

### `gtm-data-transformed.json`
Aggregated and transformed data ready for dashboard consumption:
- Grouped by month, territory, and segment
- Separate fields for actuals vs targets
- Pre-calculated metrics
- Optimized for dashboard performance

## 🔄 Keeping Data Fresh

### Manual Refresh
Run the fetch script whenever you want updated data:
```bash
node fetch-gtm-data.js
```

### Automated Refresh (Recommended)
Set up a cron job to fetch data daily:

```bash
# Edit your crontab
crontab -e

# Add this line to run daily at 6 AM
0 6 * * * cd /path/to/website && /usr/bin/node fetch-gtm-data.js >> logs/fetch.log 2>&1
```

### GitHub Actions (for auto-deployment)
Create `.github/workflows/fetch-data.yml`:

```yaml
name: Fetch GTM Data
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
  workflow_dispatch:  # Manual trigger

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Fetch Data
        env:
          DATABRICKS_TOKEN: ${{ secrets.DATABRICKS_TOKEN }}
          DATABRICKS_URL: ${{ secrets.DATABRICKS_URL }}
          DATABRICKS_WAREHOUSE_ID: ${{ secrets.DATABRICKS_WAREHOUSE_ID }}
        run: node fetch-gtm-data.js

      - name: Commit Data
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add assets/data/
          git commit -m "Update GTM data [skip ci]" || echo "No changes"
          git push
```

## 🎯 Current Dashboard Features

### Tabs
1. **Executive Summary** - High-level KPI cards
2. **Marketing & Pipeline** - MQLs, pipeline generation, deal flow
3. **Commercial** - Signed deals, win rates, sales metrics
4. **Payments, CS & Support** - Fintech and customer success metrics

### Filters
- **Territory**: Total GTM, North America, EMEA, APAC, LATAM
- **Year**: 2025, 2024
- **Current Month**: Select reporting month

### Views
- **Monthly**: Last 3 months of current quarter with % to target
- **Quarterly**: Q1-Q4 actuals with % to target
- **YTD**: Year-to-date vs full year plan with %

## 🔧 Troubleshooting

### "Cannot find module" error
```bash
# Install Node.js if not already installed
# Then no additional packages needed - uses built-in modules
```

### "DATABRICKS_TOKEN not set" error
```bash
# Make sure you've exported the environment variable
export DATABRICKS_TOKEN="your-token-here"

# Or source your .env file if using one
source .env
```

### "Query failed" or timeout errors
- Check that your SQL Warehouse is running in Databricks
- Verify your token has query permissions
- Try increasing the `wait_timeout` in fetch-gtm-data.js

### CORS errors in browser
- Make sure you're running a local web server (not opening file:// directly)
- Data files must be served from the same origin as the HTML

### Empty or missing data
- Check that 2025 data exists in your Databricks tables
- Modify the year parameter in fetch-gtm-data.js if needed
- Verify the `series` column contains both 'actual' and 'target' values

## 📈 Next Steps

### Now
- ✅ Fetch your first data
- ✅ View the dashboard
- ✅ Share with stakeholders for feedback

### Soon
- [ ] Set up automated data refresh
- [ ] Add more territories/segments
- [ ] Customize the dashboard visuals
- [ ] Add historical data (2024, 2023)

### Future Enhancements
- [ ] Real-time API integration (bypass JSON files)
- [ ] Authentication for secure access
- [ ] Export to PDF/Excel
- [ ] Custom date range selection
- [ ] Forecasting and trend analysis
- [ ] Team and individual rep views

## 💡 Tips

1. **First Time Setup**: Start with mock data to verify dashboard works, then switch to live data
2. **Performance**: The JSON files load quickly. For larger datasets, consider pagination
3. **Security**: Never commit your token! It's in .gitignore for safety
4. **Customization**: Edit `gtm-dashboard.js` to add new metrics or visualizations
5. **Sharing**: Deploy to GitHub Pages or internal hosting for team access

## 📞 Need Help?

- Check `GTM_DASHBOARD_README.md` for full documentation
- Review `DATABRICKS_SETUP.md` for detailed configuration
- Run queries in `DATABRICKS_QUERIES.sql` to test your connection

---

**Ready to see your live GTM data? Run the fetcher and refresh your dashboard!** 🚀
