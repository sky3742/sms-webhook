# SMS Webhook Dashboard

A Next.js application that receives SMS messages via webhook and displays them in a dashboard.

## Features

- **Webhook Endpoint**: Receives SMS messages from SMS Forwarder
- **SQLite Storage**: All messages are stored in a local SQLite database
- **Dashboard**: View all received messages with timestamps
- **Real-time Updates**: Refresh to see new messages

## Setup

1. **Install dependencies**:

```bash
npm install
```

2. **Run the development server**:

```bash
npm run dev
```

3. **Open in browser**:

```
http://localhost:3000
```

## SMS Forwarder Configuration

### Webhook URL

Set the webhook URL in SMS Forwarder to:

```
http://your-server-ip:3000/api/webhook
```

### Message Format

SMS Forwarder sends POST requests with JSON:

```json
{
  "subject": "sender name or phone number",
  "message": "SMS content"
}
```

### Response

The server responds with:

```json
{
  "success": true,
  "message_id": 1,
  "timestamp": 1234567890
}
```

## API Endpoints

### POST /api/webhook

Receive SMS messages from SMS Forwarder.

**Request Body:**

```json
{
  "subject": "string",
  "message": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message_id": 1,
  "timestamp": 1234567890
}
```

### GET /api/webhook

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "message_count": 10,
  "timestamp": 1234567890
}
```

### GET / (Dashboard)

View all received messages.

## Database

The SQLite database (`sms.db`) is located in the project root.

### Schema

```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t sms-webhook .
docker run -p 3000:3000 sms-webhook
```

### Production URL

For SMS Forwarder to work, the webhook URL must be publicly accessible. Use:

- Vercel (free tier)
- Railway
- Render
- Your own VPS

Example: `https://your-app.vercel.app/api/webhook`

## Security Notes

1. **HTTPS**: Use HTTPS in production for secure webhook delivery
2. **Authentication**: Consider adding API key authentication to the webhook endpoint
3. **Rate Limiting**: Implement rate limiting to prevent abuse

## Troubleshooting

### Messages not arriving

1. Check that SMS Forwarder webhook URL is correct
2. Verify the server is running and accessible
3. Check server logs for errors
4. Test the webhook endpoint manually

### Database errors

1. Ensure `sms.db` has proper permissions
2. Check that better-sqlite3 is installed
3. Verify SQLite is properly initialized

## License

MIT
