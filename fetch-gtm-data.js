/**
 * Databricks Data Fetcher for GTM Dashboard
 * Fetches live data from Databricks and generates JSON for the dashboard
 * Run with: node fetch-gtm-data.js
 */

const https = require('https');
const fs = require('fs');

// Load configuration
const CONFIG = {
  baseUrl: process.env.DATABRICKS_URL || 'https://adb-5769108933149883.3.azuredatabricks.net',
  warehouseId: process.env.DATABRICKS_WAREHOUSE_ID || 'aebcaaff2f9457a3',
  token: process.env.DATABRICKS_TOKEN,
  database: 'gtm',
  schema: 'key_metrics_targets_and_actuals'
};

// Validate configuration
if (!CONFIG.token) {
  console.error('❌ Error: DATABRICKS_TOKEN environment variable not set!');
  console.error('Set it with: export DATABRICKS_TOKEN="your-token"');
  process.exit(1);
}

/**
 * Execute SQL query against Databricks
 */
async function executeQuery(sql, description) {
  console.log(`\n🔍 ${description}...`);

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      warehouse_id: CONFIG.warehouseId,
      statement: sql,
      wait_timeout: '60s'
    });

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
          if (res.statusCode === 200 && response.status?.state === 'SUCCEEDED') {
            console.log(`✅ ${description} - Success (${response.result?.row_count || 0} rows)`);
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
 * Parse query results into array of objects
 */
function parseResults(response) {
  if (!response.result || !response.result.data_array) {
    return [];
  }

  const columns = response.manifest.schema.columns.map(col => col.name);
  const rows = response.result.data_array;

  return rows.map(row => {
    const obj = {};
    columns.forEach((col, index) => {
      obj[col] = row[index];
    });
    return obj;
  });
}

/**
 * Fetch MQLs data
 */
async function fetchMQLs(year = 2025) {
  const sql = `
    SELECT
      series,
      date,
      month,
      type_value as territory,
      simple_segment as segment,
      number_of_mqls as value
    FROM ${CONFIG.database}.${CONFIG.schema}.mqls
    WHERE YEAR(date) = ${year}
      AND series IN ('actual', 'target')
      -- 'target' = official internal target (not 'quota' or 'board plan')
    ORDER BY date, territory, segment
  `;

  const response = await executeQuery(sql, 'Fetching MQLs data');
  return parseResults(response);
}

/**
 * Fetch Pipeline data
 */
async function fetchPipeline(year = 2025) {
  const sql = `
    SELECT
      series,
      date,
      month,
      customer_territory as territory,
      customer_segment as segment,
      grouped_lead_source as channel,
      saas_mrr,
      saas_arr,
      net_arr,
      number_of_opps
    FROM ${CONFIG.database}.${CONFIG.schema}.pipeline_created
    WHERE YEAR(date) = ${year}
      AND series IN ('actual', 'target')
      -- 'target' = official internal target (not 'quota' or 'board plan')
    ORDER BY date, territory, segment
  `;

  const response = await executeQuery(sql, 'Fetching Pipeline data');
  return parseResults(response);
}

/**
 * Fetch Signed Deals data
 */
async function fetchSignedDeals(year = 2025) {
  const sql = `
    SELECT
      series,
      date,
      month,
      year,
      customer_region as region,
      customer_territory as territory,
      customer_simple_segment as segment,
      product_type,
      sale_type,
      grouped_owner_team as owner_team,
      saas_mrr,
      saas_arr,
      payments_mrr,
      payments_arr,
      net_arr,
      number_of_deals,
      number_of_properties
    FROM ${CONFIG.database}.${CONFIG.schema}.signed_deals
    WHERE year = ${year}
      AND series IN ('actual', 'target')
      -- 'target' = official internal target (not 'quota' or 'board plan')
    ORDER BY date, territory, segment
  `;

  const response = await executeQuery(sql, 'Fetching Signed Deals data');
  return parseResults(response);
}

/**
 * Transform raw data into dashboard format
 */
function transformData(mqls, pipeline, signedDeals) {
  // Group by month and aggregate
  const monthlyData = {};

  // Process MQLs
  mqls.forEach(row => {
    const key = `${row.month}_${row.territory}_${row.segment}`;
    if (!monthlyData[key]) {
      monthlyData[key] = {
        month: row.month,
        territory: row.territory,
        segment: row.segment,
        mqls_actual: 0,
        mqls_target: 0
      };
    }
    if (row.series === 'actual') {
      monthlyData[key].mqls_actual += row.value || 0;
    } else if (row.series === 'target') {
      monthlyData[key].mqls_target += row.value || 0;
    }
  });

  // Process Pipeline
  pipeline.forEach(row => {
    const key = `${row.month}_${row.territory}_${row.segment}`;
    if (!monthlyData[key]) {
      monthlyData[key] = {
        month: row.month,
        territory: row.territory,
        segment: row.segment
      };
    }
    if (row.series === 'actual') {
      monthlyData[key].pipeline_mrr_actual = (monthlyData[key].pipeline_mrr_actual || 0) + (row.saas_mrr || 0);
      monthlyData[key].pipeline_arr_actual = (monthlyData[key].pipeline_arr_actual || 0) + (row.saas_arr || 0);
      monthlyData[key].pipeline_opps_actual = (monthlyData[key].pipeline_opps_actual || 0) + (row.number_of_opps || 0);
    } else if (row.series === 'target') {
      monthlyData[key].pipeline_mrr_target = (monthlyData[key].pipeline_mrr_target || 0) + (row.saas_mrr || 0);
      monthlyData[key].pipeline_arr_target = (monthlyData[key].pipeline_arr_target || 0) + (row.saas_arr || 0);
      monthlyData[key].pipeline_opps_target = (monthlyData[key].pipeline_opps_target || 0) + (row.number_of_opps || 0);
    }
  });

  // Process Signed Deals
  signedDeals.forEach(row => {
    const key = `${row.month}_${row.territory}_${row.segment}`;
    if (!monthlyData[key]) {
      monthlyData[key] = {
        month: row.month,
        territory: row.territory,
        segment: row.segment
      };
    }
    if (row.series === 'actual') {
      monthlyData[key].signed_mrr_actual = (monthlyData[key].signed_mrr_actual || 0) + (row.saas_mrr || 0);
      monthlyData[key].signed_arr_actual = (monthlyData[key].signed_arr_actual || 0) + (row.saas_arr || 0);
      monthlyData[key].signed_deals_actual = (monthlyData[key].signed_deals_actual || 0) + (row.number_of_deals || 0);
    } else if (row.series === 'target') {
      monthlyData[key].signed_mrr_target = (monthlyData[key].signed_mrr_target || 0) + (row.saas_mrr || 0);
      monthlyData[key].signed_arr_target = (monthlyData[key].signed_arr_target || 0) + (row.saas_arr || 0);
      monthlyData[key].signed_deals_target = (monthlyData[key].signed_deals_target || 0) + (row.number_of_deals || 0);
    }
  });

  return Object.values(monthlyData);
}

/**
 * Main execution
 */
async function main() {
  console.log('=' .repeat(80));
  console.log('📊 Fetching GTM Data from Databricks');
  console.log('=' .repeat(80));

  try {
    // Fetch all data
    const [mqls, pipeline, signedDeals] = await Promise.all([
      fetchMQLs(2025),
      fetchPipeline(2025),
      fetchSignedDeals(2025)
    ]);

    console.log('\n📈 Data Summary:');
    console.log(`  - MQLs: ${mqls.length} rows`);
    console.log(`  - Pipeline: ${pipeline.length} rows`);
    console.log(`  - Signed Deals: ${signedDeals.length} rows`);

    // Transform data
    console.log('\n🔄 Transforming data...');
    const transformedData = transformData(mqls, pipeline, signedDeals);

    // Save to JSON files
    console.log('\n💾 Saving data files...');

    const outputDir = './assets/data';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(`${outputDir}/gtm-data-raw.json`, JSON.stringify({
      mqls,
      pipeline,
      signedDeals,
      fetchedAt: new Date().toISOString()
    }, null, 2));

    fs.writeFileSync(`${outputDir}/gtm-data-transformed.json`, JSON.stringify({
      data: transformedData,
      fetchedAt: new Date().toISOString(),
      totalRecords: transformedData.length
    }, null, 2));

    console.log(`✅ Data saved to ${outputDir}/`);
    console.log(`   - gtm-data-raw.json (${mqls.length + pipeline.length + signedDeals.length} total rows)`);
    console.log(`   - gtm-data-transformed.json (${transformedData.length} aggregated rows)`);

    console.log('\n✨ Done! You can now use this data in your dashboard.');
    console.log('\n💡 Tip: Run this script regularly (e.g., daily via cron) to keep data fresh.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { fetchMQLs, fetchPipeline, fetchSignedDeals, transformData };
