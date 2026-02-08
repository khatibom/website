/**
 * Databricks Schema Explorer Script
 * Run with: node explore-databricks.js
 */

const https = require('https');

// Load configuration from environment variables or external config file
// DO NOT hardcode credentials here!
const CONFIG = {
  baseUrl: process.env.DATABRICKS_URL || 'YOUR_DATABRICKS_URL',
  warehouseId: process.env.DATABRICKS_WAREHOUSE_ID || 'YOUR_WAREHOUSE_ID',
  token: process.env.DATABRICKS_TOKEN || 'YOUR_TOKEN',
  database: process.env.DATABRICKS_DATABASE || 'gtm'
};

// Validate configuration
if (CONFIG.token === 'YOUR_TOKEN') {
  console.error('❌ Error: Databricks credentials not configured!');
  console.error('Please set environment variables:');
  console.error('  export DATABRICKS_URL="https://adb-xxxx.azuredatabricks.net"');
  console.error('  export DATABRICKS_WAREHOUSE_ID="your-warehouse-id"');
  console.error('  export DATABRICKS_TOKEN="your-token"');
  console.error('  export DATABRICKS_DATABASE="gtm"');
  process.exit(1);
}

/**
 * Execute a SQL query against Databricks
 */
async function executeQuery(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      warehouse_id: CONFIG.warehouseId,
      statement: sql,
      wait_timeout: '60s',
      catalog: 'main',
      schema: CONFIG.database
    });

    // Extract hostname from baseUrl
    const hostname = CONFIG.baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    const options = {
      hostname: hostname,
      port: 443,
      path: '/api/2.0/sql/statements',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(response);
          } else {
            reject(new Error(`Query failed: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Format query results for display
 */
function formatResults(response) {
  if (!response.result || !response.result.data_array) {
    return 'No data returned';
  }

  const columns = response.manifest.schema.columns.map(col => col.name);
  const rows = response.result.data_array;

  let output = '\n' + columns.join(' | ') + '\n';
  output += columns.map(() => '---').join(' | ') + '\n';

  rows.forEach(row => {
    output += row.join(' | ') + '\n';
  });

  return output;
}

/**
 * Main exploration function
 */
async function explore() {
  console.log('🔍 Exploring Databricks GTM Schema...\n');
  console.log('=' .repeat(80));

  try {
    // 1. Check MQLs table schema
    console.log('\n📊 MQLs Table Schema:');
    console.log('-'.repeat(80));
    const mqls_schema = await executeQuery('DESCRIBE gtm.key_metrics_targets_and_actuals.mqls');
    console.log(formatResults(mqls_schema));

    // 2. Check Pipeline table schema
    console.log('\n📊 Pipeline Created Table Schema:');
    console.log('-'.repeat(80));
    const pipeline_schema = await executeQuery('DESCRIBE gtm.key_metrics_targets_and_actuals.pipeline_created');
    console.log(formatResults(pipeline_schema));

    // 3. Check Signed Deals table schema
    console.log('\n📊 Signed Deals Table Schema:');
    console.log('-'.repeat(80));
    const signed_schema = await executeQuery('DESCRIBE gtm.key_metrics_targets_and_actuals.signed_deals');
    console.log(formatResults(signed_schema));

    // 4. Sample MQLs data
    console.log('\n📋 Sample MQLs Data (5 rows):');
    console.log('-'.repeat(80));
    const mqls_sample = await executeQuery('SELECT * FROM gtm.key_metrics_targets_and_actuals.mqls LIMIT 5');
    console.log(formatResults(mqls_sample));

    // 5. Check available territories
    console.log('\n🌍 Available Territories:');
    console.log('-'.repeat(80));
    const territories = await executeQuery('SELECT DISTINCT territory FROM gtm.key_metrics_targets_and_actuals.mqls ORDER BY territory');
    console.log(formatResults(territories));

    // 6. Check available segments
    console.log('\n📈 Available Segments:');
    console.log('-'.repeat(80));
    const segments = await executeQuery('SELECT DISTINCT segment FROM gtm.key_metrics_targets_and_actuals.mqls WHERE segment IS NOT NULL ORDER BY segment');
    console.log(formatResults(segments));

    // 7. Check date range
    console.log('\n📅 Date Range Available:');
    console.log('-'.repeat(80));
    const dates = await executeQuery(`
      SELECT
        MIN(date) as earliest_date,
        MAX(date) as latest_date,
        COUNT(*) as total_rows
      FROM gtm.key_metrics_targets_and_actuals.mqls
    `);
    console.log(formatResults(dates));

    // 8. Sample recent data with all key fields
    console.log('\n📋 Recent MQLs Data (latest 3 months):');
    console.log('-'.repeat(80));
    const recent = await executeQuery(`
      SELECT
        date,
        territory,
        segment,
        channel,
        metric_value,
        target_value
      FROM gtm.key_metrics_targets_and_actuals.mqls
      WHERE date >= DATE_SUB(CURRENT_DATE(), 90)
      ORDER BY date DESC
      LIMIT 10
    `);
    console.log(formatResults(recent));

    console.log('\n✅ Exploration complete!\n');
    console.log('=' .repeat(80));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

// Run exploration
explore();
