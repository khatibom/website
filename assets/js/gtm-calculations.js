/**
 * GTM Dashboard Calculation Utilities
 * Handles target calculations, aggregations, and metric computations
 */

class GTMCalculations {
  /**
   * Calculate pro-rated target based on time elapsed
   * @param {number} annualTarget - Full year target
   * @param {number} monthsElapsed - Number of months that have passed
   * @param {number} totalMonths - Total months in the period (default 12)
   * @returns {number} Pro-rated target
   */
  static calculateProRatedTarget(annualTarget, monthsElapsed, totalMonths = 12) {
    return (annualTarget / totalMonths) * monthsElapsed;
  }

  /**
   * Calculate percentage to target
   * @param {number} actual - Actual value achieved
   * @param {number} target - Target value
   * @returns {number} Percentage (as decimal, e.g., 0.95 for 95%)
   */
  static calculatePercentToTarget(actual, target) {
    if (!target || target === 0) return null;
    return actual / target;
  }

  /**
   * Calculate quarterly aggregate from monthly values
   * @param {Object} monthlyData - Object with monthly MetricValue objects
   * @param {number} year - Year
   * @param {number} quarter - Quarter (1-4)
   * @returns {MetricValue} Aggregated quarterly value
   */
  static aggregateQuarterly(monthlyData, year, quarter) {
    const monthsInQuarter = [
      (quarter - 1) * 3 + 1,
      (quarter - 1) * 3 + 2,
      (quarter - 1) * 3 + 3
    ];

    let totalActual = 0;
    let totalTarget = 0;
    let hasData = false;

    monthsInQuarter.forEach(month => {
      const key = `${year}-${String(month).padStart(2, '0')}`;
      if (monthlyData[key]) {
        totalActual += monthlyData[key].actual || 0;
        totalTarget += monthlyData[key].target || 0;
        hasData = true;
      }
    });

    if (!hasData) return null;

    return new MetricValue(totalActual, totalTarget);
  }

  /**
   * Calculate YTD aggregate
   * @param {Object} monthlyData - Object with monthly MetricValue objects
   * @param {number} year - Year
   * @param {number} currentMonth - Current month (1-12)
   * @returns {MetricValue} YTD aggregated value
   */
  static aggregateYTD(monthlyData, year, currentMonth) {
    let totalActual = 0;
    let totalTarget = 0;
    let hasData = false;

    for (let month = 1; month <= currentMonth; month++) {
      const key = `${year}-${String(month).padStart(2, '0')}`;
      if (monthlyData[key]) {
        totalActual += monthlyData[key].actual || 0;
        totalTarget += monthlyData[key].target || 0;
        hasData = true;
      }
    }

    if (!hasData) return null;

    return new MetricValue(totalActual, totalTarget);
  }

  /**
   * Calculate average for ratio-based metrics (e.g., win rate, commission rate)
   * @param {Object} monthlyData - Object with monthly MetricValue objects
   * @param {number} year - Year
   * @param {number} quarter - Quarter (1-4)
   * @returns {MetricValue} Average value for the quarter
   */
  static averageQuarterly(monthlyData, year, quarter) {
    const monthsInQuarter = [
      (quarter - 1) * 3 + 1,
      (quarter - 1) * 3 + 2,
      (quarter - 1) * 3 + 3
    ];

    let sum = 0;
    let count = 0;

    monthsInQuarter.forEach(month => {
      const key = `${year}-${String(month).padStart(2, '0')}`;
      if (monthlyData[key] && monthlyData[key].actual !== null) {
        sum += monthlyData[key].actual;
        count++;
      }
    });

    if (count === 0) return null;

    const avgActual = sum / count;
    // For averages, we typically compare to a target average, not aggregate
    const firstMonthKey = `${year}-${String(monthsInQuarter[0]).padStart(2, '0')}`;
    const avgTarget = monthlyData[firstMonthKey]?.target || null;

    return new MetricValue(avgActual, avgTarget);
  }

  /**
   * Format currency value
   * @param {number} value - Value to format
   * @param {string} currency - Currency code (default 'EUR')
   * @param {boolean} compact - Use compact notation (e.g., €1.2M)
   * @returns {string} Formatted currency string
   */
  static formatCurrency(value, currency = 'EUR', compact = true) {
    if (value === null || value === undefined) return 'N/A';

    if (compact) {
      const absValue = Math.abs(value);
      const sign = value < 0 ? '-' : '';

      if (absValue >= 1000000) {
        return `${sign}€${(absValue / 1000000).toFixed(2)}M`;
      } else if (absValue >= 1000) {
        return `${sign}€${(absValue / 1000).toFixed(0)}k`;
      }
      return `${sign}€${absValue.toFixed(0)}`;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Format percentage value
   * @param {number} value - Value as decimal (e.g., 0.95 for 95%)
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage string
   */
  static formatPercentage(value, decimals = 0) {
    if (value === null || value === undefined) return 'N/A';
    return `${(value * 100).toFixed(decimals)}%`;
  }

  /**
   * Format number with thousands separator
   * @param {number} value - Value to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted number string
   */
  static formatNumber(value, decimals = 0) {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  /**
   * Format days
   * @param {number} value - Number of days
   * @returns {string} Formatted days string
   */
  static formatDays(value) {
    if (value === null || value === undefined) return 'N/A';
    return `${Math.round(value)} days`;
  }

  /**
   * Format value based on metric unit type
   * @param {number} value - Value to format
   * @param {string} unit - Unit type ('currency', 'percentage', 'number', 'days')
   * @param {boolean} compact - Use compact notation for currency
   * @returns {string} Formatted value
   */
  static formatValue(value, unit, compact = true) {
    switch (unit) {
      case 'currency':
        return this.formatCurrency(value, 'EUR', compact);
      case 'percentage':
        return this.formatPercentage(value);
      case 'days':
        return this.formatDays(value);
      case 'number':
      default:
        return this.formatNumber(value);
    }
  }

  /**
   * Get status color class based on percentage to target
   * @param {number} percentToTarget - Percentage as decimal
   * @param {boolean} inverse - True if lower is better (e.g., churn, sales cycle)
   * @returns {string} CSS class name
   */
  static getStatusClass(percentToTarget, inverse = false) {
    if (percentToTarget === null || percentToTarget === undefined) return 'status-neutral';

    let status;
    if (inverse) {
      // For metrics where lower is better (churn, cycle time, etc.)
      if (percentToTarget <= 0.8) status = 'good';
      else if (percentToTarget <= 1.0) status = 'warning';
      else status = 'poor';
    } else {
      // For metrics where higher is better (revenue, pipeline, etc.)
      if (percentToTarget >= 1.0) status = 'good';
      else if (percentToTarget >= 0.8) status = 'warning';
      else status = 'poor';
    }

    return `status-${status}`;
  }

  /**
   * Calculate pipeline deals from pipeline value and average deal size
   * @param {number} pipelineValue - Total pipeline value
   * @param {number} avgDealSize - Average deal size
   * @returns {number} Number of deals in pipeline
   */
  static calculatePipelineDeals(pipelineValue, avgDealSize) {
    if (!avgDealSize || avgDealSize === 0) return null;
    return Math.round(pipelineValue / avgDealSize);
  }

  /**
   * Calculate win rate from won and total deals
   * @param {number} wonDeals - Number of won deals
   * @param {number} totalDeals - Total number of deals (won + lost)
   * @returns {number} Win rate as decimal
   */
  static calculateWinRate(wonDeals, totalDeals) {
    if (!totalDeals || totalDeals === 0) return null;
    return wonDeals / totalDeals;
  }

  /**
   * Calculate NRR (Net Revenue Retention)
   * @param {number} startingARR - ARR at start of period
   * @param {number} upsell - Upsell revenue
   * @param {number} downsell - Downsell revenue
   * @param {number} churn - Churned revenue
   * @returns {number} NRR as decimal
   */
  static calculateNRR(startingARR, upsell, downsell, churn) {
    if (!startingARR || startingARR === 0) return null;
    return (startingARR + upsell - downsell - churn) / startingARR;
  }

  /**
   * Calculate pipeline coverage
   * @param {number} pipelineValue - Total pipeline value
   * @param {number} remainingQuota - Remaining quota to hit
   * @returns {number} Coverage ratio as decimal
   */
  static calculatePipelineCoverage(pipelineValue, remainingQuota) {
    if (!remainingQuota || remainingQuota === 0) return null;
    return pipelineValue / remainingQuota;
  }

  /**
   * Get month name from month number
   * @param {number} month - Month (1-12)
   * @returns {string} Month abbreviation
   */
  static getMonthName(month, short = true) {
    const months = {
      1: { short: 'Jan', long: 'January' },
      2: { short: 'Feb', long: 'February' },
      3: { short: 'Mar', long: 'March' },
      4: { short: 'Apr', long: 'April' },
      5: { short: 'May', long: 'May' },
      6: { short: 'Jun', long: 'June' },
      7: { short: 'Jul', long: 'July' },
      8: { short: 'Aug', long: 'August' },
      9: { short: 'Sep', long: 'September' },
      10: { short: 'Oct', long: 'October' },
      11: { short: 'Nov', long: 'November' },
      12: { short: 'Dec', long: 'December' }
    };
    return short ? months[month].short : months[month].long;
  }

  /**
   * Get quarter months
   * @param {number} quarter - Quarter (1-4)
   * @returns {Array} Array of month numbers in the quarter
   */
  static getQuarterMonths(quarter) {
    return [
      (quarter - 1) * 3 + 1,
      (quarter - 1) * 3 + 2,
      (quarter - 1) * 3 + 3
    ];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GTMCalculations;
}
