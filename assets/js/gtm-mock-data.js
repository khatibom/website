/**
 * GTM Dashboard Mock Data
 * Based on the QBR report structure shown in the images
 * This data will be replaced with live Databricks data once access is granted
 */

// Current fiscal year and month
const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 1; // January (first month of 2026)
const CURRENT_QUARTER = 1;

/**
 * Generate mock data for Total GTM - Marketing & Pipeline
 */
function generateMarketingPipelineData() {
  return {
    // MQLs by quarter (Q4 2024 actuals shown in image)
    handraiserMQLs: {
      monthly: {
        '2025-10': new MetricValue(1652, 1652 * 1.96 / 1.96, 196/100), // Oct: 196% of target
        '2025-11': new MetricValue(1301, 1301 * 1.54 / 1.54, 154/100), // Nov: 154% of target
        '2025-12': new MetricValue(883, 883 * 1.05 / 1.05, 105/100)    // Dec: 105% of target
      },
      quarterly: {
        '2025-Q1': new MetricValue(4734, 4734 / 1.43, 143/100),
        '2025-Q2': new MetricValue(4656, 4656 / 1.24, 124/100),
        '2025-Q3': new MetricValue(3008, 3008 / 1.19, 119/100),
        '2025-Q4': new MetricValue(3836, 3836 / 1.52, 152/100)
      },
      ytd: new MetricValue(16234, 12153, 134/100),
      fy: new MetricValue(16234, 12153, 134/100)
    },

    // SaaS PMRR Pipeline (in €000s)
    saasPmrrPipeline: {
      monthly: {
        '2025-10': new MetricValue(983, 983 / 1.06, 106/100),
        '2025-11': new MetricValue(1098, 1098 / 1.17, 117/100),
        '2025-12': new MetricValue(824, 824 / 0.90, 90/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(2231, 2231 / 0.87, 87/100),
        '2025-Q2': new MetricValue(2409, 2409 / 0.85, 85/100),
        '2025-Q3': new MetricValue(3001, 3001 / 1.11, 111/100),
        '2025-Q4': new MetricValue(2905, 2905 / 1.05, 105/100)
      },
      ytd: new MetricValue(10541, 10816, 97/100),
      fy: new MetricValue(10541, 10816, 97/100)
    },

    // Pipeline Deals
    pipelineDeals: {
      monthly: {
        '2025-10': new MetricValue(1182, 1182 / 1.53, 153/100),
        '2025-11': new MetricValue(1008, 1008 / 1.30, 130/100),
        '2025-12': new MetricValue(844, 844 / 1.12, 112/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(2089, 2089 / 0.99, 99/100),
        '2025-Q2': new MetricValue(2415, 2415 / 1.02, 102/100),
        '2025-Q3': new MetricValue(2705, 2705 / 1.21, 121/100),
        '2025-Q4': new MetricValue(3034, 3034 / 1.32, 132/100)
      },
      ytd: new MetricValue(10243, 8998, 114/100),
      fy: new MetricValue(10243, 8998, 114/100)
    },

    // Pipeline Average Deal Size (in €)
    pipelineAvgDealSize: {
      monthly: {
        '2025-10': new MetricValue(831, 831 / 0.69, 69/100),
        '2025-11': new MetricValue(1089, 1089 / 0.90, 90/100),
        '2025-12': new MetricValue(977, 977 / 0.81, 81/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(1068, 1068 / 0.88, 88/100),
        '2025-Q2': new MetricValue(996, 996 / 0.83, 83/100),
        '2025-Q3': new MetricValue(1109, 1109 / 0.91, 91/100),
        '2025-Q4': new MetricValue(957, 957 / 0.80, 80/100)
      },
      ytd: new MetricValue(1029, 1209, 85/100),
      fy: new MetricValue(1029, 1209, 85/100)
    }
  };
}

/**
 * Generate mock data for Total GTM - Commercial
 */
function generateCommercialData() {
  return {
    // SaaS PMRR Signed (in €000s)
    saasPmrrSigned: {
      monthly: {
        '2025-10': new MetricValue(217, 217 / 0.84, 84/100),
        '2025-11': new MetricValue(266, 266 / 0.97, 97/100),
        '2025-12': new MetricValue(225, 225 / 0.82, 82/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(412, 412 / 0.82, 82/100),
        '2025-Q2': new MetricValue(644, 644 / 1.04, 104/100),
        '2025-Q3': new MetricValue(498, 498 / 0.91, 91/100),
        '2025-Q4': new MetricValue(708, 708 / 0.88, 88/100)
      },
      ytd: new MetricValue(2262, 2476, 91/100),
      fy: new MetricValue(2262, 2476, 91/100)
    },

    // Win Rate
    winRate: {
      monthly: {
        '2025-10': new MetricValue(0.31, 0.31, null),
        '2025-11': new MetricValue(0.35, 0.35, null),
        '2025-12': new MetricValue(0.38, 0.38, null)
      },
      quarterly: {
        '2025-Q1': new MetricValue(0.33, 0.34, 97/100),
        '2025-Q2': new MetricValue(0.35, 0.34, 103/100),
        '2025-Q3': new MetricValue(0.32, 0.34, 94/100),
        '2025-Q4': new MetricValue(0.35, 0.34, 103/100)
      },
      ytd: new MetricValue(0.34, 0.34, 100/100),
      fy: new MetricValue(0.34, 0.34, 100/100)
    },

    // Average Deal Size (in €)
    avgDealSize: {
      monthly: {
        '2025-10': new MetricValue(526, 526 / 1.09, 109/100),
        '2025-11': new MetricValue(589, 589 / 1.21, 121/100),
        '2025-12': new MetricValue(548, 548 / 1.11, 111/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(586, 586 / 1.07, 107/100),
        '2025-Q2': new MetricValue(681, 681 / 1.20, 120/100),
        '2025-Q3': new MetricValue(683, 683 / 1.14, 114/100),
        '2025-Q4': new MetricValue(653, 653 / 1.14, 114/100)
      },
      ytd: new MetricValue(620, 571, 109/100),
      fy: new MetricValue(620, 571, 109/100)
    },

    // Average Sales Cycle Days
    avgSalesCycleDays: {
      monthly: {
        '2025-10': new MetricValue(64, 64, null),
        '2025-11': new MetricValue(52, 52, null),
        '2025-12': new MetricValue(58, 58, null)
      },
      quarterly: {
        '2025-Q1': new MetricValue(59, 59, null),
        '2025-Q2': new MetricValue(61, 61, null),
        '2025-Q3': new MetricValue(57, 57, null),
        '2025-Q4': new MetricValue(57, 57, null)
      },
      ytd: new MetricValue(58, 58, null),
      fy: new MetricValue(58, 58, null)
    },

    // % of SMB Reps Hitting Target
    smbRepsHittingTarget: {
      quarterly: {
        '2025-Q1': new MetricValue(0.34, 0.34, null),
        '2025-Q2': new MetricValue(0.31, 0.31, null),
        '2025-Q3': new MetricValue(0.32, 0.32, null),
        '2025-Q4': new MetricValue(0.25, 0.25, null)
      }
    },

    // % of MM Reps Hitting Target
    mmRepsHittingTarget: {
      quarterly: {
        '2025-Q1': new MetricValue(0.36, 0.36, null),
        '2025-Q2': new MetricValue(0.57, 0.57, null),
        '2025-Q3': new MetricValue(0.46, 0.46, null),
        '2025-Q4': new MetricValue(0.50, 0.50, null)
      }
    }
  };
}

/**
 * Generate mock data for Total GTM - Payments, CS & Support
 */
function generatePaymentsCSData() {
  return {
    // PMS & POS Activated (in €000s)
    pmsActivated: {
      monthly: {
        '2025-10': new MetricValue(190, 190 / 0.73, 73/100),
        '2025-11': new MetricValue(146, 146 / 0.44, 44/100),
        '2025-12': new MetricValue(138, 138 / 0.59, 59/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(473, 473 / 0.86, 86/100),
        '2025-Q2': new MetricValue(396, 396 / 0.56, 56/100),
        '2025-Q3': new MetricValue(350, 350 / 0.73, 73/100),
        '2025-Q4': new MetricValue(474, 474 / 0.57, 57/100)
      },
      ytd: new MetricValue(1633, 2397, 68/100),
      fy: new MetricValue(1633, 2397, 68/100)
    },

    // Mews PMS Revenue (in €M)
    mewsPmsRevenue: {
      quarterly: {
        '2025-Q1': new MetricValue(12.4, 12.4, null),
        '2025-Q2': new MetricValue(13.3, 13.3, null),
        '2025-Q3': new MetricValue(13.7, 13.7, null),
        '2025-Q4': new MetricValue(13.9, 13.9, null)
      },
      ytd: new MetricValue(53.3, 53.3, null),
      fy: new MetricValue(53.3, 53.3, null)
    },

    // Total Payments Volume (in €M)
    totalPaymentsVolume: {
      monthly: {
        '2025-10': new MetricValue(1485, 1485 / 0.81, 81/100),
        '2025-11': new MetricValue(1259, 1259 / 0.73, 73/100),
        '2025-12': new MetricValue(1351, 1351 / 0.80, 80/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(3088, 3088 / 1.00, 100/100),
        '2025-Q2': new MetricValue(4022, 4022 / 0.93, 93/100),
        '2025-Q3': new MetricValue(4810, 4810 / 0.91, 91/100),
        '2025-Q4': new MetricValue(4095, 4095 / 0.78, 78/100)
      },
      ytd: new MetricValue(16015, 17941, 89/100),
      fy: new MetricValue(16015, 17941, 89/100)
    },

    // Mews Payments Volume (in €M)
    mewsPaymentsVolume: {
      monthly: {
        '2025-10': new MetricValue(816, 816 / 0.80, 80/100),
        '2025-11': new MetricValue(690, 690 / 0.74, 74/100),
        '2025-12': new MetricValue(723, 723 / 0.80, 80/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(1649, 1649 / 1.01, 101/100),
        '2025-Q2': new MetricValue(2273, 2273 / 0.93, 93/100),
        '2025-Q3': new MetricValue(2824, 2824 / 0.92, 92/100),
        '2025-Q4': new MetricValue(2229, 2229 / 0.78, 78/100)
      },
      ytd: new MetricValue(8976, 9984, 90/100),
      fy: new MetricValue(8976, 9984, 90/100)
    },

    // Share of Wallet
    shareOfWallet: {
      monthly: {
        '2025-10': new MetricValue(0.857, 0.857 / 1.04, 104/100),
        '2025-11': new MetricValue(0.918, 0.918 / 1.04, 104/100),
        '2025-12': new MetricValue(0.903, 0.903 / 1.06, 106/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(0.873, 0.873 / 1.02, 102/100),
        '2025-Q2': new MetricValue(0.878, 0.878 / 1.02, 102/100),
        '2025-Q3': new MetricValue(0.888, 0.888 / 1.03, 103/100),
        '2025-Q4': new MetricValue(0.906, 0.906 / 1.05, 105/100)
      },
      ytd: new MetricValue(0.887, 0.863, 103/100),
      fy: new MetricValue(0.887, 0.863, 103/100)
    },

    // Churn %
    churn: {
      monthly: {
        '2025-10': new MetricValue(0.007, 0.007 / 0.90, 90/100),
        '2025-11': new MetricValue(0.008, 0.008 / 1.13, 113/100),
        '2025-12': new MetricValue(0.006, 0.006 / 1.03, 103/100)
      },
      quarterly: {
        '2025-Q1': new MetricValue(0.019, 0.019 / 0.98, 98/100),
        '2025-Q2': new MetricValue(0.022, 0.022 / 1.09, 109/100),
        '2025-Q3': new MetricValue(0.016, 0.016 / 0.74, 74/100),
        '2025-Q4': new MetricValue(0.024, 0.024 / 1.02, 102/100)
      },
      ytd: new MetricValue(0.082, null, null),
      fy: new MetricValue(0.082, null, null)
    }
  };
}

/**
 * Generate segment breakdowns (SMB, Mid-Market, Enterprise)
 */
function generateSegmentBreakdowns() {
  return {
    SMB: {
      // Pipeline by quarter
      saasPmrrPipeline: {
        quarterly: {
          '2025-Q1': new MetricValue(972, 972 / 0.87, 87/100),
          '2025-Q2': new MetricValue(1150, 1150 / 0.92, 92/100),
          '2025-Q3': new MetricValue(1190, 1190 / 0.97, 97/100),
          '2025-Q4': new MetricValue(1436, 1436 / 1.16, 116/100)
        },
        ytd: new MetricValue(4748, 4831, 98/100),
        fy: new MetricValue(4748, 4831, 98/100)
      },
      // Signed revenue
      saasPmrrSigned: {
        quarterly: {
          '2025-Q1': new MetricValue(203, 203 / 0.75, 75/100),
          '2025-Q2': new MetricValue(278, 278 / 0.77, 77/100),
          '2025-Q3': new MetricValue(286, 286 / 0.84, 84/100),
          '2025-Q4': new MetricValue(375, 375 / 0.76, 76/100)
        },
        ytd: new MetricValue(1142, 1466, 78/100),
        fy: new MetricValue(1142, 1466, 78/100)
      }
    },
    'Mid-Market': {
      saasPmrrPipeline: {
        quarterly: {
          '2025-Q1': new MetricValue(1198, 1198 / 0.83, 83/100),
          '2025-Q2': new MetricValue(1148, 1148 / 0.72, 72/100),
          '2025-Q3': new MetricValue(1258, 1258 / 0.85, 85/100),
          '2025-Q4': new MetricValue(1422, 1422 / 0.93, 93/100)
        },
        ytd: new MetricValue(5025, 6049, 83/100),
        fy: new MetricValue(5025, 6049, 83/100)
      },
      saasPmrrSigned: {
        quarterly: {
          '2025-Q1': new MetricValue(195, 195 / 1.01, 101/100),
          '2025-Q2': new MetricValue(355, 355 / 1.59, 159/100),
          '2025-Q3': new MetricValue(199, 199 / 1.13, 113/100),
          '2025-Q4': new MetricValue(302, 302 / 1.08, 108/100)
        },
        ytd: new MetricValue(1050, 871, 121/100),
        fy: new MetricValue(1050, 871, 121/100)
      }
    },
    'Enterprise': {
      saasPmrrPipeline: {
        quarterly: {
          '2025-Q1': new MetricValue(60, 60, null),
          '2025-Q2': new MetricValue(107, 107, null),
          '2025-Q3': new MetricValue(553, 553, null),
          '2025-Q4': new MetricValue(47, 47, null)
        },
        ytd: new MetricValue(768, null, null),
        fy: new MetricValue(768, null, null)
      },
      saasPmrrSigned: {
        quarterly: {
          '2025-Q1': new MetricValue(14, 14 / 0.37, 37/100),
          '2025-Q2': new MetricValue(11, 11 / 0.32, 32/100),
          '2025-Q3': new MetricValue(13, 13 / 0.37, 37/100),
          '2025-Q4': new MetricValue(32, 32 / 0.93, 93/100)
        },
        ytd: new MetricValue(69, 140, 49/100),
        fy: new MetricValue(69, 140, 49/100)
      }
    }
  };
}

/**
 * Get all mock data
 */
function getAllMockData() {
  return {
    currentYear: CURRENT_YEAR,
    currentMonth: CURRENT_MONTH,
    currentQuarter: CURRENT_QUARTER,
    totalGTM: {
      marketingPipeline: generateMarketingPipelineData(),
      commercial: generateCommercialData(),
      paymentsCS: generatePaymentsCSData()
    },
    segments: generateSegmentBreakdowns()
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAllMockData,
    CURRENT_YEAR,
    CURRENT_MONTH,
    CURRENT_QUARTER
  };
}
