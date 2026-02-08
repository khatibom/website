/**
 * GTM Dashboard - Databricks Integration Layer
 * This module handles data fetching from Mews GTM Databricks
 *
 * TO BE IMPLEMENTED: Once Databricks access is granted, replace mock data calls
 * with actual API calls to the Databricks SQL warehouse
 */

class DatabricksClient {
  constructor(config) {
    this.baseUrl = config.baseUrl || 'https://your-databricks-instance.cloud.databricks.com';
    this.warehouseId = config.warehouseId;
    this.token = config.token;
    this.timeout = config.timeout || 30000; // 30 seconds
  }

  /**
   * Execute a SQL query against Databricks
   * @param {string} query - SQL query to execute
   * @returns {Promise<Object>} Query results
   */
  async executeQuery(query) {
    const endpoint = `/api/2.0/sql/statements/`;

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          warehouse_id: this.warehouseId,
          statement: query,
          wait_timeout: `${this.timeout}ms`
        })
      });

      if (!response.ok) {
        throw new Error(`Databricks query failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseQueryResults(data);
    } catch (error) {
      console.error('Databricks query error:', error);
      throw error;
    }
  }

  /**
   * Parse Databricks query results into usable format
   * @param {Object} rawData - Raw response from Databricks
   * @returns {Array<Object>} Parsed results
   */
  parseQueryResults(rawData) {
    if (!rawData.result || !rawData.result.data_array) {
      return [];
    }

    const columns = rawData.manifest.schema.columns.map(col => col.name);
    const rows = rawData.result.data_array;

    return rows.map(row => {
      const obj = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
  }

  /**
   * Fetch MQL data from Databricks
   * @param {number} year - Year to fetch data for
   * @param {string} territory - Territory filter
   * @returns {Promise<Object>} MQL data structured for the dashboard
   */
  async fetchMQLData(year, territory = null) {
    const territoryFilter = territory ? `AND territory = '${territory}'` : '';

    const query = `
      SELECT
        year,
        month,
        quarter,
        territory,
        segment,
        channel,
        mql_count,
        mql_target,
        mql_count / mql_target as percent_to_target
      FROM mews_gtm.kbm_mqls
      WHERE year = ${year}
        ${territoryFilter}
      ORDER BY year, month
    `;

    const results = await this.executeQuery(query);
    return this.transformToMetricData(results, 'mql_count', 'mql_target');
  }

  /**
   * Fetch Pipeline data from Databricks
   * @param {number} year - Year to fetch data for
   * @param {string} territory - Territory filter
   * @returns {Promise<Object>} Pipeline data structured for the dashboard
   */
  async fetchPipelineData(year, territory = null) {
    const territoryFilter = territory ? `AND territory = '${territory}'` : '';

    const query = `
      SELECT
        year,
        month,
        quarter,
        territory,
        segment,
        channel,
        pipeline_value_pmrr,
        pipeline_target_pmrr,
        pipeline_deals,
        pipeline_deals_target,
        avg_deal_size,
        avg_deal_size_target
      FROM mews_gtm.kbm_pipeline
      WHERE year = ${year}
        ${territoryFilter}
      ORDER BY year, month
    `;

    const results = await this.executeQuery(query);
    return {
      pipelineValue: this.transformToMetricData(results, 'pipeline_value_pmrr', 'pipeline_target_pmrr'),
      pipelineDeals: this.transformToMetricData(results, 'pipeline_deals', 'pipeline_deals_target'),
      avgDealSize: this.transformToMetricData(results, 'avg_deal_size', 'avg_deal_size_target')
    };
  }

  /**
   * Fetch Signed Deals data from Databricks
   * @param {number} year - Year to fetch data for
   * @param {string} territory - Territory filter
   * @returns {Promise<Object>} Signed deals data
   */
  async fetchSignedDealsData(year, territory = null) {
    const territoryFilter = territory ? `AND territory = '${territory}'` : '';

    const query = `
      SELECT
        year,
        month,
        quarter,
        territory,
        segment,
        signed_pmrr,
        signed_pmrr_target,
        signed_arr,
        signed_arr_target,
        won_deals,
        total_deals,
        avg_deal_size,
        median_deal_size,
        avg_sales_cycle_days
      FROM mews_gtm.kbm_signed_deals
      WHERE year = ${year}
        ${territoryFilter}
      ORDER BY year, month
    `;

    const results = await this.executeQuery(query);
    return {
      signedPmrr: this.transformToMetricData(results, 'signed_pmrr', 'signed_pmrr_target'),
      signedArr: this.transformToMetricData(results, 'signed_arr', 'signed_arr_target'),
      avgDealSize: this.transformToMetricData(results, 'avg_deal_size', null),
      medianDealSize: this.transformToMetricData(results, 'median_deal_size', null),
      avgSalesCycle: this.transformToMetricData(results, 'avg_sales_cycle_days', null),
      winRate: this.calculateWinRate(results)
    };
  }

  /**
   * Fetch Payments & CS data from Databricks
   * @param {number} year - Year to fetch data for
   * @param {string} territory - Territory filter
   * @returns {Promise<Object>} Payments and CS data
   */
  async fetchPaymentsData(year, territory = null) {
    const territoryFilter = territory ? `AND territory = '${territory}'` : '';

    const query = `
      SELECT
        year,
        month,
        quarter,
        territory,
        segment,
        pms_activated_pmrr,
        pms_activated_target,
        payments_volume,
        payments_volume_target,
        mews_payments_volume,
        total_volume,
        share_of_wallet,
        sow_target,
        churn_rate,
        churn_target,
        pms_revenue
      FROM mews_gtm.kbm_payments_cs
      WHERE year = ${year}
        ${territoryFilter}
      ORDER BY year, month
    `;

    const results = await this.executeQuery(query);
    return {
      pmsActivated: this.transformToMetricData(results, 'pms_activated_pmrr', 'pms_activated_target'),
      paymentsVolume: this.transformToMetricData(results, 'payments_volume', 'payments_volume_target'),
      mewsPaymentsVolume: this.transformToMetricData(results, 'mews_payments_volume', null),
      shareOfWallet: this.transformToMetricData(results, 'share_of_wallet', 'sow_target'),
      churn: this.transformToMetricData(results, 'churn_rate', 'churn_target'),
      pmsRevenue: this.transformToMetricData(results, 'pms_revenue', null)
    };
  }

  /**
   * Transform raw query results into MetricData structure
   * @param {Array<Object>} results - Raw query results
   * @param {string} actualField - Field name for actual values
   * @param {string} targetField - Field name for target values (can be null)
   * @returns {Object} Structured metric data with monthly/quarterly/ytd
   */
  transformToMetricData(results, actualField, targetField) {
    const monthly = {};
    const quarterly = {};
    let ytdActual = 0;
    let ytdTarget = 0;

    results.forEach(row => {
      const actual = row[actualField];
      const target = targetField ? row[targetField] : null;
      const percentToTarget = target ? actual / target : null;

      // Monthly data
      if (row.month) {
        const monthKey = `${row.year}-${String(row.month).padStart(2, '0')}`;
        monthly[monthKey] = new MetricValue(actual, target, percentToTarget);
        ytdActual += actual;
        if (target) ytdTarget += target;
      }

      // Quarterly data (aggregate if needed)
      if (row.quarter) {
        const quarterKey = `${row.year}-Q${row.quarter}`;
        if (!quarterly[quarterKey]) {
          quarterly[quarterKey] = { actual: 0, target: 0 };
        }
        quarterly[quarterKey].actual += actual;
        if (target) quarterly[quarterKey].target += target;
      }
    });

    // Convert quarterly aggregates to MetricValue
    Object.keys(quarterly).forEach(key => {
      const q = quarterly[key];
      quarterly[key] = new MetricValue(
        q.actual,
        q.target || null,
        q.target ? q.actual / q.target : null
      );
    });

    // YTD and FY
    const ytd = new MetricValue(ytdActual, ytdTarget || null, ytdTarget ? ytdActual / ytdTarget : null);
    const fy = ytd; // For now, YTD = FY (will be updated with full year target)

    return {
      monthly,
      quarterly,
      ytd,
      fy
    };
  }

  /**
   * Calculate win rate from won/total deals
   */
  calculateWinRate(results) {
    const monthly = {};
    const quarterly = {};

    results.forEach(row => {
      if (row.won_deals && row.total_deals) {
        const winRate = row.won_deals / row.total_deals;

        if (row.month) {
          const monthKey = `${row.year}-${String(row.month).padStart(2, '0')}`;
          monthly[monthKey] = new MetricValue(winRate, null, null);
        }

        if (row.quarter) {
          const quarterKey = `${row.year}-Q${row.quarter}`;
          if (!quarterly[quarterKey]) {
            quarterly[quarterKey] = { won: 0, total: 0 };
          }
          quarterly[quarterKey].won += row.won_deals;
          quarterly[quarterKey].total += row.total_deals;
        }
      }
    });

    // Convert quarterly to win rate
    Object.keys(quarterly).forEach(key => {
      const q = quarterly[key];
      quarterly[key] = new MetricValue(q.won / q.total, null, null);
    });

    return { monthly, quarterly, ytd: null, fy: null };
  }

  /**
   * Fetch all GTM data for a given year and territory
   * @param {number} year - Year to fetch
   * @param {string} territory - Territory to fetch (optional)
   * @returns {Promise<Object>} Complete GTM data structure
   */
  async fetchAllData(year, territory = null) {
    try {
      // Fetch all data in parallel
      const [mqls, pipeline, signedDeals, paymentsCS] = await Promise.all([
        this.fetchMQLData(year, territory),
        this.fetchPipelineData(year, territory),
        this.fetchSignedDealsData(year, territory),
        this.fetchPaymentsData(year, territory)
      ]);

      return {
        marketingPipeline: {
          handraiserMQLs: mqls,
          ...pipeline
        },
        commercial: signedDeals,
        paymentsCS: paymentsCS
      };
    } catch (error) {
      console.error('Error fetching all GTM data:', error);
      throw error;
    }
  }
}

/**
 * Initialize Databricks client with configuration
 * Configuration should be stored securely (e.g., environment variables, secure config)
 */
function initializeDatabricksClient() {
  // TODO: Replace with actual configuration once access is granted
  const config = {
    baseUrl: process.env.DATABRICKS_BASE_URL || 'https://your-instance.cloud.databricks.com',
    warehouseId: process.env.DATABRICKS_WAREHOUSE_ID || 'your-warehouse-id',
    token: process.env.DATABRICKS_TOKEN || 'your-token',
    timeout: 30000
  };

  return new DatabricksClient(config);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DatabricksClient,
    initializeDatabricksClient
  };
}
