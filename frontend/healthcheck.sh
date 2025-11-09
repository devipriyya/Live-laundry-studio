#!/bin/sh
# Simple health check script for frontend container

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
  echo "Nginx is not running"
  exit 1
fi

# Check if we can access the main page
if ! wget --quiet --tries=1 --spider http://localhost/; then
  echo "Cannot access main page"
  exit 1
fi

echo "Health check passed"
exit 0