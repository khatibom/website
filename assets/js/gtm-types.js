/**
 * GTM Dashboard Data Types and Schema
 * Based on Mews Key Business Metrics (KBMs)
 */

// Dimension types
const Territories = {
  TOTAL_GTM: 'Total GTM',
  NORTH_AMERICA: 'North America',
  EMEA: 'EMEA',
  APAC: 'APAC',
  LATAM: 'LATAM'
};

const Segments = {
  TOTAL: 'Total',
  SMB: 'SMB',
  MID_MARKET: 'Mid-Market',
  ENTERPRISE: 'Enterprise'
};

const Channels = {
  TOTAL: 'Total',
  MARKETING: 'Marketing',
  SALES_OUTBOUND: 'Sales Outbound',
  BD_OUTBOUND: 'BD Outbound',
  PARTNERS: 'Partners',
  MNA: 'M&A',
  CE_EXPANSION: 'CE / Expansion / Sales In / Other'
};

const MetricCategories = {
  PIPELINE: 'Lead & Pipeline Generation',
  SALES: 'Sales',
  ONBOARDING: 'Onboarding & Activation',
  CS_UPSELL: 'Customer Success & Upsell',
  SUPPORT: 'Support & Post-Sales',
  CUSTOMER_BASE: 'Customer Base Overview',
  FINTECH: 'Fintech'
};

// Time period types
class TimePeriod {
  constructor(year, quarter = null, month = null) {
    this.year = year;
    this.quarter = quarter; // 1-4
    this.month = month; // 1-12
  }

  toString() {
    if (this.month) return `${this.year}-${String(this.month).padStart(2, '0')}`;
    if (this.quarter) return `${this.year}-Q${this.quarter}`;
    return `${this.year}`;
  }

  getQuarter() {
    if (this.quarter) return this.quarter;
    if (this.month) return Math.ceil(this.month / 3);
    return null;
  }
}

// Metric value with target
class MetricValue {
  constructor(actual, target = null, percentToTarget = null) {
    this.actual = actual;
    this.target = target;
    this.percentToTarget = percentToTarget || (target ? (actual / target) : null);
  }

  getStatus() {
    if (!this.percentToTarget) return 'neutral';
    if (this.percentToTarget >= 1.0) return 'good';
    if (this.percentToTarget >= 0.8) return 'warning';
    return 'poor';
  }
}

// Main metric data structure
class MetricData {
  constructor(config) {
    this.metricName = config.metricName;
    this.category = config.category;
    this.unit = config.unit || 'number'; // 'number', 'currency', 'percentage', 'days'
    this.territory = config.territory || Territories.TOTAL_GTM;
    this.segment = config.segment || Segments.TOTAL;
    this.channel = config.channel || Channels.TOTAL;

    // Time-based data
    this.monthly = config.monthly || {}; // { '2025-01': MetricValue, ... }
    this.quarterly = config.quarterly || {}; // { '2025-Q1': MetricValue, ... }
    this.ytd = config.ytd || null; // MetricValue
    this.fy = config.fy || null; // MetricValue (full year actual + plan)
  }

  getMonthlyValue(year, month) {
    const key = new TimePeriod(year, null, month).toString();
    return this.monthly[key] || null;
  }

  getQuarterlyValue(year, quarter) {
    const key = new TimePeriod(year, quarter).toString();
    return this.quarterly[key] || null;
  }
}

// KBM Definitions
const KBMDefinitions = {
  // Lead & Pipeline Generation
  MQL_CREATED: {
    name: 'MQLs Created',
    category: MetricCategories.PIPELINE,
    unit: 'number',
    definition: 'Number of Marketing Qualified Leads generated',
    owner: 'Marco'
  },
  PIPELINE_GENERATED: {
    name: 'Pipeline Generated (All Sources)',
    category: MetricCategories.PIPELINE,
    unit: 'currency',
    definition: 'Total potential revenue from active sales opportunities',
    owner: 'Marco + Iza'
  },
  PIPELINE_COVERAGE: {
    name: 'Pipeline Coverage',
    category: MetricCategories.PIPELINE,
    unit: 'percentage',
    definition: 'Ratio of pipeline value to sales targets',
    owner: 'Iza'
  },

  // Sales
  SIGNED_DEALS_PMRR: {
    name: 'Signed Deals / Revenue (PMRR)',
    category: MetricCategories.SALES,
    unit: 'currency',
    definition: 'Revenue contribution from recently signed deals (PMRR)',
    owner: 'Irina'
  },
  SIGNED_DEALS_ARR: {
    name: 'Signed Deals / Revenue (ARR)',
    category: MetricCategories.SALES,
    unit: 'currency',
    definition: 'Revenue contribution from recently signed deals (ARR)',
    owner: 'Irina'
  },
  WIN_RATE: {
    name: 'Win Rate',
    category: MetricCategories.SALES,
    unit: 'percentage',
    definition: 'Percentage of deals closed successfully',
    owner: 'Irina'
  },
  REPS_HITTING_QUOTA: {
    name: '% of Reps Hitting Quota',
    category: MetricCategories.SALES,
    unit: 'percentage',
    definition: 'Proportion of sales reps meeting their targets',
    owner: 'Irina'
  },
  AVG_DEAL_SIZE: {
    name: 'Average Deal Size',
    category: MetricCategories.SALES,
    unit: 'currency',
    definition: 'Average contract value of new deals',
    owner: 'Irina'
  },
  MEDIAN_DEAL_SIZE: {
    name: 'Median Deal Size',
    category: MetricCategories.SALES,
    unit: 'currency',
    definition: 'Median contract value of new deals',
    owner: 'Irina'
  },
  AVG_SALES_CYCLE: {
    name: 'Avg. Sales Cycle of Closed Deals',
    category: MetricCategories.SALES,
    unit: 'days',
    definition: 'Average sales cycle length from opportunity qualification until closure',
    owner: 'Irina'
  },

  // Onboarding & Activation
  ACTIVATED_REVENUE: {
    name: 'Activated Revenue',
    category: MetricCategories.ONBOARDING,
    unit: 'currency',
    definition: 'Revenue from newly activated customers',
    owner: 'Chris'
  },
  TIME_TO_REVENUE: {
    name: 'Time to Revenue (TTR)',
    category: MetricCategories.ONBOARDING,
    unit: 'days',
    definition: 'Time taken for a signed deal to generate revenue',
    owner: 'Chris'
  },
  TIME_TO_ONBOARD: {
    name: 'Time to Onboard (TTO)',
    category: MetricCategories.ONBOARDING,
    unit: 'days',
    definition: 'Duration from contract signing to full customer onboarding',
    owner: 'Chris'
  },

  // Customer Success & Upsell
  CUSTOMER_CHURN_RATE: {
    name: 'Customer Churn Rate',
    category: MetricCategories.CS_UPSELL,
    unit: 'percentage',
    definition: 'Percentage of customers leaving within a period',
    owner: 'Chris'
  },
  UPSELL_MRR: {
    name: 'Upsell (MRR)',
    category: MetricCategories.CS_UPSELL,
    unit: 'currency',
    definition: 'Revenue growth from existing customers (MRR)',
    owner: 'Edvard'
  },

  // Customer Base Overview
  ACTIVE_CUSTOMERS: {
    name: 'Active Number of Customers',
    category: MetricCategories.CUSTOMER_BASE,
    unit: 'number',
    definition: 'Total active customers on any given date',
    owner: 'Iris'
  },
  ACTIVE_PROPERTIES: {
    name: 'Active Number of Properties',
    category: MetricCategories.CUSTOMER_BASE,
    unit: 'number',
    definition: 'Total active properties on any given date',
    owner: 'Iris'
  },
  ARR_ACTIVE: {
    name: 'ARR of Active Customers',
    category: MetricCategories.CUSTOMER_BASE,
    unit: 'currency',
    definition: 'Total recurring revenue from SaaS and payments',
    owner: 'Iris'
  },
  NRR: {
    name: 'Net Revenue Retention (NRR)',
    category: MetricCategories.CUSTOMER_BASE,
    unit: 'percentage',
    definition: 'Revenue kept from existing customers plus upsell, minus downsell and churn',
    owner: 'Iris'
  },

  // Fintech
  PAYMENTS_VOLUME: {
    name: 'Payments Volume (Total)',
    category: MetricCategories.FINTECH,
    unit: 'currency',
    definition: 'Total value of processed payments',
    owner: 'Chianti'
  },
  PAYMENTS_REVENUE: {
    name: 'Payments Revenue (Net Mews Transactional Rev)',
    category: MetricCategories.FINTECH,
    unit: 'currency',
    definition: 'Net revenue generated from Mews Payments commissions',
    owner: 'Chianti'
  },
  SHARE_OF_WALLET: {
    name: 'Share of Wallet (SOW)',
    category: MetricCategories.FINTECH,
    unit: 'percentage',
    definition: "Percentage of customer's total volume processed by Mews",
    owner: 'Chianti'
  },
  MEWS_COMMISSION_RATE: {
    name: 'Mews Commission Rate',
    category: MetricCategories.FINTECH,
    unit: 'percentage',
    definition: 'Average commission earned by Mews per payment transaction',
    owner: 'Chianti'
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Territories,
    Segments,
    Channels,
    MetricCategories,
    TimePeriod,
    MetricValue,
    MetricData,
    KBMDefinitions
  };
}
