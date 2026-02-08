#!/bin/bash

# GTM Dashboard Data Fetch Helper Script
# This script makes it easy to fetch live data from Databricks

echo "================================================================================"
echo "🚀 GTM Dashboard - Data Fetch Helper"
echo "================================================================================"
echo ""

# Set Databricks credentials
if [ -z "$DATABRICKS_TOKEN" ]; then
    echo "⚠️  DATABRICKS_TOKEN not set in environment"
    read -sp "   Enter your Databricks token: " DATABRICKS_TOKEN
    echo ""
    echo ""
fi

export DATABRICKS_TOKEN
export DATABRICKS_URL="${DATABRICKS_URL:-https://adb-5769108933149883.3.azuredatabricks.net}"
export DATABRICKS_WAREHOUSE_ID="${DATABRICKS_WAREHOUSE_ID:-aebcaaff2f9457a3}"

echo "✅ Credentials configured"
echo "   - URL: $DATABRICKS_URL"
echo "   - Warehouse: $DATABRICKS_WAREHOUSE_ID"
echo ""

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo "   Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Create data directory if it doesn't exist
mkdir -p assets/data

echo "📊 Fetching live GTM data from Databricks..."
echo "   (This may take 10-30 seconds)"
echo ""

# Run the fetch script
node fetch-gtm-data.js

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================================================"
    echo "✨ Success! Data files created:"
    echo "================================================================================"
    echo ""
    ls -lh assets/data/
    echo ""
    echo "💡 Next step: View the dashboard"
    echo "   Run: ./view-dashboard.sh"
    echo ""
else
    echo ""
    echo "❌ Data fetch failed. Check the error message above."
    echo ""
    echo "Common issues:"
    echo "   - SQL Warehouse not running (start it in Databricks)"
    echo "   - Token expired (generate a new one)"
    echo "   - Network connectivity issues"
    echo ""
fi
