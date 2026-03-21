#!/bin/bash
echo "Checking backend health..."
curl -s http://localhost:9000/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Backend healthy"
  exit 0
else
  echo "❌ Backend not responding"
  exit 1
fi
