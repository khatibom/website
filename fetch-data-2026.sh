#!/bin/bash

# GTM Dashboard Data Fetch Helper Script for 2026
# Fetches January 2026 data for Monthly Business Review

echo "================================================================================"
echo "🚀 GTM Dashboard - Fetch 2026 January Data"
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
echo "   - Year: 2026"
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

echo "📊 Fetching 2026 GTM data from Databricks..."
echo "   (This may take 10-30 seconds)"
echo ""

# Run the fetch script with 2026 as the year
node fetch-gtm-data.js 2026

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================================================"
    echo "✨ Success! 2026 Data files created:"
    echo "================================================================================"
    echo ""
    ls -lh assets/data/
    echo ""
    echo "💡 Next step: View the January 2026 MBR dashboard"
    echo "   Run: ./view-dashboard.sh"
    echo ""
else
    echo ""
    echo "❌ Data fetch failed. Check the error message above."
    echo ""
fi
