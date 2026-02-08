#!/bin/bash

# GTM Dashboard Viewer Helper Script
# Starts a local web server to view the dashboard

echo "================================================================================"
echo "🌐 GTM Dashboard - Local Viewer"
echo "================================================================================"
echo ""

# Detect Python version
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Error: Python is not installed!"
    echo "   Alternative: npm install -g http-server && npx http-server"
    exit 1
fi

# Find available port (default 8000, fallback to 8001, 8002, etc.)
PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; do
    PORT=$((PORT+1))
done

echo "✅ Starting web server on port $PORT"
echo ""
echo "================================================================================"
echo "📊 Your GTM Dashboard is now running!"
echo "================================================================================"
echo ""
echo "   🔗 Open in browser: http://localhost:$PORT/gtm-dashboard.html"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""
echo "================================================================================"
echo ""

# Start Python HTTP server
$PYTHON_CMD -m http.server $PORT
