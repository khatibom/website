# GTM Dashboard - Automated Monthly Business Report

## Overview

The GTM (Go-to-Market) Dashboard is an automated monthly business reporting tool that visualizes Mews's Key Business Metrics (KBMs) across all go-to-market functions. The dashboard provides a comprehensive view of pipeline generation, sales performance, customer success, and fintech metrics with territory-level breakdowns.

## Features

### 📊 Executive Summary
- High-level overview cards showing key headlines for:
  - Pipeline generation (Q4 and full year)
  - Signed deals (PMS, RMS, other products)
  - Activated revenue
  - Payment metrics

### 📈 Marketing & Pipeline
- Handraiser MQLs tracking
- SaaS PMRR pipeline generation
- Pipeline deals count
- Average deal size analysis
- Segment breakdowns (SMB, Mid-Market, Enterprise)
- Channel performance (Marketing, Sales Outbound, BD Outbound, Partners, M&A)

### 💼 Commercial
- Signed revenue (PMRR/ARR)
- Win rate tracking (by close date and cohort)
- Average and median deal sizes
- Sales cycle duration
- Quota attainment by team

### 💳 Payments, CS & Support
- PMS & POS activated revenue
- Payments volume (total and Mews Payments)
- Share of wallet tracking
- Customer churn rates
- Mews PMS revenue

### 🎯 Time Period Views

Each metric is displayed with three time perspectives:

1. **Monthly Actuals** - Last 3 months of the current quarter with % to target
2. **Quarterly Actuals** - All 4 quarters with % to target
3. **Year-to-Date & FY Plan** - YTD performance vs full year plan with % achievement

### 🌍 Territory Breakdowns

Filter and view metrics by territory:
- Total GTM (aggregate)
- North America
- EMEA
- APAC
- LATAM

## Project Structure

```
website/
├── gtm-dashboard.html              # Main dashboard page
├── assets/
│   ├── css/
│   │   └── gtm-dashboard.css       # Dashboard styles
│   └── js/
│       ├── gtm-types.js            # Data types and KBM definitions
│       ├── gtm-calculations.js     # Calculation utilities
│       ├── gtm-mock-data.js        # Mock data (temporary)
│       ├── gtm-databricks.js       # Databricks integration layer
│       └── gtm-dashboard.js        # Main dashboard logic
└── GTM_DASHBOARD_README.md         # This file
```

## Key Business Metrics (KBMs)

The dashboard tracks Mews's standardized Key Business Metrics across categories:

### Lead & Pipeline Generation
- MQLs Created
- Pipeline Generated (All Sources)
- Pipeline Coverage

### Sales
- Signed Deals / Revenue (PMRR/ARR)
- Win Rate
- % of Reps Hitting Quota
- Average/Median Deal Size
- Average Sales Cycle

### Onboarding & Activation
- Activated Revenue
- Time to Revenue (TTR)
- Time to Onboard (TTO)

### Customer Success & Upsell
- Customer Churn Rate
- Upsell (MRR/ARR)

### Customer Base Overview
- Active Customers & Properties
- ARR of Active Customers
- Net Revenue Retention (NRR)

### Fintech
- Payments Volume
- Mews Payments Volume
- Share of Wallet
- Mews Commission Rate
- Payments Revenue

## Data Sources

### Current State (Mock Data)
The dashboard currently uses mock data that matches the structure of the Q4 2025 QBR reports. This allows for:
- UI/UX testing and refinement
- Stakeholder review and feedback
- Development of the complete dashboard structure

### Future State (Databricks Integration)

Once Databricks access is granted, the dashboard will connect to:
- **Mews GTM Databricks SQL Warehouse**
- Tables containing KBM data by territory, segment, and time period
- Real-time or scheduled data refreshes

#### Integration Steps (To Be Completed)

1. **Obtain Databricks Credentials**
   - Base URL of the Databricks instance
   - SQL Warehouse ID
   - Personal access token

2. **Configure Environment**
   ```javascript
   // In gtm-databricks.js
   const config = {
     baseUrl: 'https://your-instance.cloud.databricks.com',
     warehouseId: 'your-warehouse-id',
     token: 'your-token'
   };
   ```

3. **Update Dashboard to Use Live Data**
   ```javascript
   // In gtm-dashboard.js, replace:
   this.data = getAllMockData();

   // With:
   const client = initializeDatabricksClient();
   this.data = await client.fetchAllData(this.currentYear, this.currentTerritory);
   ```

4. **Deploy with Secure Credentials**
   - Store credentials in environment variables or secure config
   - Never commit credentials to source control

## Calculations

### Pro-Rated Targets
For YTD comparisons, annual targets are pro-rated based on the number of months elapsed:
```
Pro-rated Target = (Annual Target / 12) × Months Elapsed
```

### Percentage to Target
```
% to Target = (Actual / Target) × 100
```

### Quarterly Aggregations
Most metrics are summed across months in a quarter:
```
Q1 Actual = Jan Actual + Feb Actual + Mar Actual
```

### Average-Based Metrics
Some metrics (like win rate, sales cycle, commission rate) are averaged rather than summed:
```
Q1 Avg = (Jan + Feb + Mar) / 3
```

### Status Colors
- **Green (Good)**: ≥100% of target
- **Yellow (Warning)**: 80-99% of target
- **Red (Poor)**: <80% of target

For inverse metrics (churn, sales cycle), the logic is reversed.

## Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development) or GitHub Pages
- Basic knowledge of HTML, CSS, JavaScript

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/khatibom/website.git
   cd website
   ```

2. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js
   npx http-server
   ```

3. **Open in browser**
   ```
   http://localhost:8000/gtm-dashboard.html
   ```

### Customization

#### Adding New Metrics
1. Add metric definition to `gtm-types.js` in `KBMDefinitions`
2. Add mock data structure to `gtm-mock-data.js`
3. Add rendering logic to `gtm-dashboard.js`
4. Update Databricks queries in `gtm-databricks.js`

#### Modifying Styling
- Edit `assets/css/gtm-dashboard.css`
- CSS variables are defined in `:root` for easy theming

#### Changing Time Periods
- Update `CURRENT_YEAR`, `CURRENT_MONTH`, `CURRENT_QUARTER` in `gtm-mock-data.js`
- Filters in the UI allow dynamic selection

## Deployment

### GitHub Pages (Current)
The dashboard is hosted on GitHub Pages:
- URL: https://khatibom.github.io/website/gtm-dashboard.html
- Automatic deployment on push to `gh-pages` branch

### Future Options
- Host on internal Mews infrastructure
- Integrate with Mews business intelligence tools
- Add authentication for secure access

## Roadmap

### Phase 1: Foundation (✅ Complete)
- [x] Data schema and types
- [x] Calculation utilities
- [x] Mock data structure
- [x] Dashboard UI/UX
- [x] Territory and time period filtering
- [x] Executive summary cards
- [x] Marketing & Pipeline view
- [x] Commercial view
- [x] Payments, CS & Support view

### Phase 2: Databricks Integration (🔜 Next)
- [ ] Obtain Databricks access credentials
- [ ] Map KBM tables in Databricks
- [ ] Implement API calls in gtm-databricks.js
- [ ] Test with live data
- [ ] Add error handling and loading states
- [ ] Implement data caching

### Phase 3: Enhanced Features
- [ ] Territory drill-down with sub-territories
- [ ] Historical trend charts
- [ ] Export to PDF/Excel
- [ ] Scheduled email reports
- [ ] Custom date range selection
- [ ] Comparison views (QoQ, YoY)
- [ ] Mobile responsive optimizations

### Phase 4: Advanced Analytics
- [ ] Forecasting and projections
- [ ] Anomaly detection
- [ ] Custom metric builder
- [ ] Team and individual rep views
- [ ] Integration with Salesforce for live pipeline
- [ ] Real-time alerts and notifications

## Support and Maintenance

### Issues and Questions
- Report issues on GitHub: https://github.com/khatibom/website/issues
- Contact: Omar Khatib (omar.khatib@mews.com)

### Data Quality
- Metrics are sourced from Mews GTM Databricks
- Data refresh frequency: TBD (daily/weekly recommended)
- Data owners listed in KBM definitions

### Updates and Changes
- Dashboard updates tracked via git commits
- KBM definitions follow Mews's official KBM documentation
- Changes to metric definitions require alignment with metric owners

## Technical Details

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
- Dashboard loads in <2 seconds with mock data
- Databricks queries expected to complete in 5-10 seconds
- Client-side rendering for instant UI updates

### Security
- No sensitive data stored in client-side code
- Databricks credentials stored securely
- HTTPS-only in production
- Consider authentication for public deployments

## License

Internal Mews tool - proprietary and confidential

---

**Version**: 1.0.0
**Last Updated**: February 2026
**Status**: Mock Data / Awaiting Databricks Access
