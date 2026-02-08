/**
 * Databricks Schema Explorer
 * Query to understand the structure of GTM tables
 */

const schemaExplorationQueries = {
  // Get columns for key_metrics_targets_and_actuals tables
  mqls_schema: `DESCRIBE gtm.key_metrics_targets_and_actuals.mqls`,
  pipeline_schema: `DESCRIBE gtm.key_metrics_targets_and_actuals.pipeline_created`,
  signed_deals_schema: `DESCRIBE gtm.key_metrics_targets_and_actuals.signed_deals`,
  activation_schema: `DESCRIBE gtm.key_metrics_targets_and_actuals.activation`,
  payments_schema: `DESCRIBE gtm.key_metrics_targets_and_actuals.payments`,
  win_rates_schema: `DESCRIBE gtm.key_metrics_targets_and_actuals.win_rates`,

  // Sample data queries
  mqls_sample: `SELECT * FROM gtm.key_metrics_targets_and_actuals.mqls LIMIT 5`,
  pipeline_sample: `SELECT * FROM gtm.key_metrics_targets_and_actuals.pipeline_created LIMIT 5`,
  signed_deals_sample: `SELECT * FROM gtm.key_metrics_targets_and_actuals.signed_deals LIMIT 5`,

  // Check what territories and segments are available
  territories: `SELECT DISTINCT territory FROM gtm.key_metrics_targets_and_actuals.mqls`,
  segments: `SELECT DISTINCT segment FROM gtm.key_metrics_targets_and_actuals.mqls`,

  // Check date range available
  date_range: `
    SELECT
      MIN(date) as earliest_date,
      MAX(date) as latest_date
    FROM gtm.key_metrics_targets_and_actuals.mqls
  `
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = schemaExplorationQueries;
}
