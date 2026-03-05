#!/bin/bash

# Test SMS Forwarder webhook endpoint

echo "Testing SMS Forwarder webhook endpoint..."
echo ""

# Test with example payload
subject="+1234567890"
if [ -n "$WEBHOOK_AUTH_TOKEN" ]; then
  subject="sender=+1234567890|token=$WEBHOOK_AUTH_TOKEN"
fi

curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d "{
    \"subject\": \"$subject\",
    \"message\": \"This is a test message from SMS Forwarder\"
  }"

echo ""
echo ""
echo "Checking dashboard..."
echo "Open http://localhost:3000 in your browser"
