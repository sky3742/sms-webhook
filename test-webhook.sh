#!/bin/bash

# Test SMS Forwarder webhook endpoint

echo "Testing SMS Forwarder webhook endpoint..."
echo ""

# Test with example payload
if [ -n "$WEBHOOK_AUTH_TOKEN" ]; then
  curl -X POST http://localhost:3000/api/webhook \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Token: $WEBHOOK_AUTH_TOKEN" \
    -d '{
      "sender": "+1234567890",
      "message": "This is a test message from SMS Forwarder"
    }'
else
  curl -X POST http://localhost:3000/api/webhook \
    -H "Content-Type: application/json" \
    -d '{
      "sender": "+1234567890",
      "message": "This is a test message from SMS Forwarder"
    }'
fi

echo ""
echo ""
echo "Checking dashboard..."
echo "Open http://localhost:3000 in your browser"
