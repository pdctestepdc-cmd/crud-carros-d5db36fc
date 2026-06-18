#!/bin/sh
set -e
cat > /usr/share/nginx/html/config.js <<EOF
window.__API_BASE__ = "${API_BASE_URL:-}";
EOF
