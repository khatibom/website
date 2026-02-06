# Mews Deals Profit Calculator

## Overview

This calculator helps analyze the financial metrics for new signed Mews deals, providing insights into profitability, customer lifetime value (LTV), and return on acquisition investment.

## Features

### Input Parameters

1. **Average Deal Size**: Number of hotels in the deal
2. **Average Monthly Payments Volume**: Total monthly payments processed (in USD)
3. **Region**: Geographic region (North America, EMEA, APAC, LATAM)
4. **Segment**: Customer segment (Enterprise, Mid-Market, SMB)
5. **Low Tier Rate**: Commission/take rate percentage

### Calculated Metrics

#### Gross Profit
- **Year 1 Profit per Hotel**: Expected profit per hotel in the first year
- **Year 1 Total Profit**: Total profit for the entire deal in year 1
- **Year 2 Profit per Hotel**: Expected profit per hotel in the second year
- **Year 2 Total Profit**: Total profit for the entire deal in year 2

#### LTV Metrics
- **Lifetime Value (LTV)**: Total expected profit per hotel over its lifetime
- **Customer Acquisition Cost (CAC)**: Cost to acquire each hotel
- **LTV/CAC Ratio**: Efficiency metric (higher is better, 3x+ is good)
- **CAC Payback Period**: Months required to recover acquisition costs

## Backend Configuration

The calculator uses region and segment-specific data stored in `assets/js/config.js`:

### 1. Signed to Go-Live Timing
Time from deal signature to when the hotel goes live (in months):
- **Enterprise**: 6-8 months (varies by region)
- **Mid-Market**: 4-6 months
- **SMB**: 2-4 months

### 2. Payments Ramp
Monthly adoption rate showing what % of full payment volume is achieved each month after go-live:
- **Enterprise**: 6-8 month ramp to 100%
- **Mid-Market**: 5-6 month ramp to 100%
- **SMB**: 3-4 month ramp to 100%

### 3. Customer Acquisition Cost (CAC)
Cost per hotel varies by region and segment:
- **Enterprise**: $15,000 - $20,000
- **Mid-Market**: $8,000 - $11,000
- **SMB**: $3,000 - $4,000

### 4. Churn Rates
Annual churn rates (lower is better):
- **Enterprise**: 8% - 13%
- **Mid-Market**: 12% - 18%
- **SMB**: 20% - 30%

## Calculation Methodology

### Year 1 & Year 2 Profit

1. Account for signed → go-live delay
2. Apply progressive payment ramp schedule
3. Calculate: `Monthly Volume × Ramp % × Low Tier Rate`
4. Sum across all months
5. Divide by deal size for per-hotel metrics

### Lifetime Value (LTV)

```
Annual Profit at Full Ramp = Monthly Volume × Low Tier Rate × 12
Customer Lifetime = 1 / Churn Rate
LTV = Annual Profit at Full Ramp × Customer Lifetime
```

### CAC Payback Period

Time required to recover the customer acquisition cost from cumulative profits, accounting for the ramp period.

## Usage

1. Navigate to [calculator.html](calculator.html)
2. Enter your deal parameters
3. Click "Calculate"
4. Review results including detailed monthly breakdown

## Files

- `calculator.html`: Main calculator interface
- `assets/js/calculator.js`: Calculation engine
- `assets/js/config.js`: Backend configuration data
- `assets/css/calculator.css`: Styling

## Updating Backend Data

To modify regional or segment parameters, edit `assets/js/config.js` and adjust:
- `signedToGoLive`: Timing windows
- `paymentsRamp`: Ramp schedules
- `cac`: Acquisition costs
- `churnRate`: Churn percentages
