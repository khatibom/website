-- ============================================================================
-- Databricks Schema Exploration Queries
-- Run these in your Databricks SQL Editor and share the results
-- ============================================================================

-- Query 1: MQLs Table Schema
-- Copy and paste this into Databricks SQL Editor
DESCRIBE gtm.key_metrics_targets_and_actuals.mqls;

-- Query 2: Pipeline Table Schema
DESCRIBE gtm.key_metrics_targets_and_actuals.pipeline_created;

-- Query 3: Signed Deals Table Schema
DESCRIBE gtm.key_metrics_targets_and_actuals.signed_deals;

-- Query 4: Activation Table Schema
DESCRIBE gtm.key_metrics_targets_and_actuals.activation;

-- Query 5: Payments Table Schema
DESCRIBE gtm.key_metrics_targets_and_actuals.payments;

-- Query 6: Win Rates Table Schema
DESCRIBE gtm.key_metrics_targets_and_actuals.win_rates;

-- ============================================================================
-- Sample Data Queries
-- ============================================================================

-- Query 7: Sample MQLs Data (show me what the data looks like)
SELECT *
FROM gtm.key_metrics_targets_and_actuals.mqls
LIMIT 10;

-- Query 8: Sample Pipeline Data
SELECT *
FROM gtm.key_metrics_targets_and_actuals.pipeline_created
LIMIT 10;

-- Query 9: Sample Signed Deals Data
SELECT *
FROM gtm.key_metrics_targets_and_actuals.signed_deals
LIMIT 10;

-- ============================================================================
-- Metadata Queries
-- ============================================================================

-- Query 10: Available Territories
SELECT DISTINCT territory
FROM gtm.key_metrics_targets_and_actuals.mqls
WHERE territory IS NOT NULL
ORDER BY territory;

-- Query 11: Available Segments
SELECT DISTINCT segment
FROM gtm.key_metrics_targets_and_actuals.mqls
WHERE segment IS NOT NULL
ORDER BY segment;

-- Query 12: Available Channels
SELECT DISTINCT channel
FROM gtm.key_metrics_targets_and_actuals.mqls
WHERE channel IS NOT NULL
ORDER BY channel;

-- Query 13: Date Range Available
SELECT
  MIN(date) as earliest_date,
  MAX(date) as latest_date,
  COUNT(DISTINCT date) as total_dates
FROM gtm.key_metrics_targets_and_actuals.mqls;

-- ============================================================================
-- Data Structure Check (Most Important!)
-- ============================================================================

-- Query 14: Recent MQLs data with all dimensions
-- This shows me exactly how the data is structured
SELECT
  date,
  territory,
  segment,
  channel,
  metric_value,
  target_value,
  DATE_FORMAT(date, 'yyyy-MM') as year_month,
  QUARTER(date) as quarter
FROM gtm.key_metrics_targets_and_actuals.mqls
WHERE date >= DATE_SUB(CURRENT_DATE(), 90)
ORDER BY date DESC, territory, segment
LIMIT 20;

-- ============================================================================
-- Quick Test Query for Dashboard
-- ============================================================================

-- Query 15: Q4 2025 MQLs Summary by Territory
-- This is similar to what we'll need for the dashboard
SELECT
  territory,
  segment,
  MONTH(date) as month,
  QUARTER(date) as quarter,
  SUM(metric_value) as actual,
  SUM(target_value) as target,
  SUM(metric_value) / NULLIF(SUM(target_value), 0) as percent_to_target
FROM gtm.key_metrics_targets_and_actuals.mqls
WHERE YEAR(date) = 2025 AND QUARTER(date) = 4
GROUP BY territory, segment, MONTH(date), QUARTER(date)
ORDER BY territory, segment, month;
