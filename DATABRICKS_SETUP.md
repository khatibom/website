# Databricks Integration Setup

## Security Notice

**IMPORTANT**: Never commit Databricks credentials to git! The credentials are stored in `assets/js/databricks-config.js` which is excluded from version control via `.gitignore`.

## Setting Up Credentials

### Option 1: Local Config File (for browser-based dashboard)

Create `assets/js/databricks-config.js`:

```javascript
const DATABRICKS_CONFIG = {
  baseUrl: 'https://adb-5769108933149883.3.azuredatabricks.net',
  warehouseId: 'aebcaaff2f9457a3',
  token: 'YOUR_DATABRICKS_TOKEN_HERE',
  database: 'gtm',
  timeout: 60000
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DATABRICKS_CONFIG;
}
```

### Option 2: Environment Variables (for Node.js scripts)

For running the exploration script (`explore-databricks.js`):

```bash
# Set environment variables
export DATABRICKS_URL="https://adb-5769108933149883.3.azuredatabricks.net"
export DATABRICKS_WAREHOUSE_ID="aebcaaff2f9457a3"
export DATABRICKS_TOKEN="YOUR_DATABRICKS_TOKEN_HERE"
export DATABRICKS_DATABASE="gtm"

# Run the exploration script
node explore-databricks.js
```

Or create a `.env` file (also in `.gitignore`):

```bash
DATABRICKS_URL=https://adb-5769108933149883.3.azuredatabricks.net
DATABRICKS_WAREHOUSE_ID=aebcaaff2f9457a3
DATABRICKS_TOKEN=YOUR_DATABRICKS_TOKEN_HERE
DATABRICKS_DATABASE=gtm
```

## Exploring the Schema

### Quick Method: Run SQL in Databricks UI

Open the `DATABRICKS_QUERIES.sql` file and run the queries in your Databricks SQL Editor. The key queries to run are:

1. **Query 7**: Sample MQLs Data
2. **Query 8**: Sample Pipeline Data
3. **Query 9**: Sample Signed Deals Data

### Automated Method: Node.js Script

If you have Node.js installed and network access to Databricks:

```bash
# Set environment variables (see above)
node explore-databricks.js
```

This will automatically query all table schemas and sample data.

## Credentials Information

Your current Databricks setup:
- **Instance**: Azure Databricks (adb-5769108933149883.3.azuredatabricks.net)
- **Workspace ID**: 5769108933149883
- **SQL Warehouse**: aebcaaff2f9457a3
- **Database**: gtm
- **Token**: dapi666656... (first 10 chars only for reference)

## Tables Available

Based on the Databricks catalog browser:

### `gtm.key_metrics_targets_and_actuals`
- `activation`
- `mqls`
- `payments`
- `pipeline_created`
- `signed_deals`
- `win_rates`

### `gtm.key_metrics_agg_actuals`
- `activation`
- `average_sales_cycle`
- `average_sales_price`
- `case_volume`
- `first_response_sla`
- `mqls_agg_actuals`
- `number_of_sales_reps_hitting_qu...`
- `open_pipeline`
- `payment_metrics_agg_actuals`
- `pipeline_coverage`
- `pipeline_created`
- `signed_deals`
- `support_cases_agg_actuals`

## Next Steps

1. ✅ Create the config file (Option 1) or set environment variables (Option 2)
2. Run the exploration queries to understand table structures
3. Update the dashboard integration code in `assets/js/gtm-databricks.js`
4. Test the dashboard with live data
5. Deploy and celebrate! 🎉

## Troubleshooting

**Issue**: "Cannot find module 'databricks-config.js'"
- **Solution**: Make sure you created the config file in `assets/js/databricks-config.js`

**Issue**: Network/DNS errors when running Node.js script
- **Solution**: Run the SQL queries directly in Databricks UI instead

**Issue**: GitHub push protection blocking credentials
- **Solution**: Never commit credentials files. Check `.gitignore` includes them.

**Issue**: CORS errors in browser
- **Solution**: May need a backend proxy server for production (browser can't call Databricks API directly)
