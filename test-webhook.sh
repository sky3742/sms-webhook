#!/bin/bash

# Test SMS Forwarder webhook endpoint

echo "Testing SMS Forwarder webhook endpoint..."
echo ""

# Test with example payload
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test SMS",
    "message": "This is a test message from SMS Forwarder"
  }'

echo ""
echo ""
echo "Checking dashboard..."
echo "Open http://localhost:3000 in your browser"
