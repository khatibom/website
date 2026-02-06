// Backend configuration data for Mews Deals Profit Calculator

const CONFIG = {
  // Signed to Go-Live timing (months from signed to go-live)
  signedToGoLive: {
    'north-america': {
      'enterprise': 6,
      'mid-market': 4,
      'smb': 2
    },
    'emea': {
      'enterprise': 7,
      'mid-market': 5,
      'smb': 3
    },
    'apac': {
      'enterprise': 8,
      'mid-market': 6,
      'smb': 4
    },
    'latam': {
      'enterprise': 7,
      'mid-market': 5,
      'smb': 3
    }
  },

  // Payments ramp (monthly adoption rate after go-live)
  // Represents % of full volume achieved each month after go-live
  paymentsRamp: {
    'north-america': {
      'enterprise': [0.3, 0.5, 0.7, 0.85, 0.95, 1.0], // Reaches 100% in month 6
      'mid-market': [0.4, 0.6, 0.8, 0.95, 1.0],        // Reaches 100% in month 5
      'smb': [0.5, 0.8, 1.0]                           // Reaches 100% in month 3
    },
    'emea': {
      'enterprise': [0.25, 0.45, 0.65, 0.80, 0.90, 0.95, 1.0], // 7 months
      'mid-market': [0.35, 0.55, 0.75, 0.90, 1.0],             // 5 months
      'smb': [0.45, 0.75, 0.95, 1.0]                           // 4 months
    },
    'apac': {
      'enterprise': [0.2, 0.35, 0.5, 0.65, 0.80, 0.90, 0.95, 1.0], // 8 months
      'mid-market': [0.3, 0.5, 0.7, 0.85, 0.95, 1.0],              // 6 months
      'smb': [0.4, 0.7, 0.9, 1.0]                                  // 4 months
    },
    'latam': {
      'enterprise': [0.25, 0.4, 0.6, 0.75, 0.85, 0.95, 1.0],  // 7 months
      'mid-market': [0.35, 0.55, 0.75, 0.9, 1.0],             // 5 months
      'smb': [0.45, 0.75, 0.95, 1.0]                          // 4 months
    }
  },

  // Customer Acquisition Cost (CAC) per hotel by region and segment
  cac: {
    'north-america': {
      'enterprise': 15000,
      'mid-market': 8000,
      'smb': 3000
    },
    'emea': {
      'enterprise': 18000,
      'mid-market': 9500,
      'smb': 3500
    },
    'apac': {
      'enterprise': 20000,
      'mid-market': 11000,
      'smb': 4000
    },
    'latam': {
      'enterprise': 17000,
      'mid-market': 9000,
      'smb': 3200
    }
  },

  // Annual churn rates (as decimal, e.g., 0.15 = 15% annual churn)
  churnRate: {
    'north-america': {
      'enterprise': 0.08,
      'mid-market': 0.12,
      'smb': 0.20
    },
    'emea': {
      'enterprise': 0.10,
      'mid-market': 0.15,
      'smb': 0.25
    },
    'apac': {
      'enterprise': 0.12,
      'mid-market': 0.18,
      'smb': 0.28
    },
    'latam': {
      'enterprise': 0.13,
      'mid-market': 0.18,
      'smb': 0.30
    }
  },

  // Average customer lifetime in years (calculated from churn)
  // Lifetime = 1 / churn_rate
  getLifetime: function(region, segment) {
    const churn = this.churnRate[region][segment];
    return 1 / churn;
  }
};
