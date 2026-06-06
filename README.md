# SMS Webhook Dashboard

A Next.js application that receives SMS messages via webhook and displays them in a dashboard.

## Features

- **Webhook Endpoint**: Receives SMS messages via webhook
- **Push Notifications**: Browser push notifications with VAPID authentication
- **Auth Modes**: Email/password or passcode-based login
- **Dashboard**: View messages with expand/collapse, pagination, and pull-to-refresh
- **Real-time Updates**: Auto-refreshes when tab is revisited
- **Security**: Rate limiting, timing-safe comparisons, security headers

## Setup

1. **Install dependencies**:

```bash
npm install
```

2. **Configure environment variables**:

```bash
cp .env.example .env
```

Required auth/security variables:

- `BETTER_AUTH_SECRET`
- `AUTH_ADMIN_EMAIL`
- `AUTH_ADMIN_PASSWORD`

Optional:

- `AUTH_MODE` — `email` (default) or `passcode`
- `AUTH_PASSCODE` — secret passcode when `AUTH_MODE=passcode`
- `WEBHOOK_AUTH_TOKEN` (recommended for anti-spam/fake SMS protection)
- `PUSH_NOTIFICATION_ICON` and `PUSH_NOTIFICATION_BADGE` (icon customization)
  - defaults: `/notification-icon.png` and `/notification-badge.png`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_CONTACT_EMAIL` (for push notifications)

3. **Run database migrations**:

```bash
npm run db:migrate
```

4. **Run the development server**:

```bash
npm run dev
```

5. **Open in browser**:

```
http://localhost:3000/login
```

## SMS Forwarder Configuration

### Webhook URL

Set the webhook URL in SMS Forwarder to:

```
http://your-server-ip:3000/api/webhook
```

### Forwarder Payload Contract

Because the forwarder is custom and under your control, the webhook expects a
strict payload:

```json
{
  "sender": "+1234567890",
  "message": "SMS content",
  "token": "optional-token"
}
```

Recommended auth:

- Put token in header: `X-Webhook-Token: <token>`
- Or send `Authorization: Bearer <token>`
- Body `token` is also accepted for compatibility

### Response

The server responds with:

```json
{
  "success": true,
  "message_id": 1,
  "timestamp": "2026-06-06T00:00:00.000Z",
  "sender": "+1234567890",
  "notifications_sent": 1
}
```

## API Endpoints

### POST /api/webhook

Receive SMS messages from SMS Forwarder.

**Request Body:**

```json
{
  "sender": "+1234567890",
  "message": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message_id": 1,
  "timestamp": "2026-06-06T00:00:00.000Z",
  "sender": "+1234567890",
  "notifications_sent": 1
}
```

### GET /api/webhook

Health check endpoint. Requires `WEBHOOK_AUTH_TOKEN` if set.

**Response:**

```json
{
  "status": "ok",
  "message_count": 10,
  "timestamp": 1780000000000
}
```

### GET / (Dashboard)

View all received messages (authenticated users only).

### /api/auth/\*

Better Auth endpoints used for session authentication.

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

CREATE TABLE push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
```

Additional tables (`user`, `session`, `account`, `verification`) are managed by
[better-auth](https://www.better-auth.com/).

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
2. **Dashboard Auth**: Better Auth protects the dashboard and delete actions (email/password or passcode mode)
3. **Webhook Token (Optional)**: Set `WEBHOOK_AUTH_TOKEN` and send it via `X-Webhook-Token` or `Authorization: Bearer ...`
4. **Rate Limiting**: Passcode endpoint is rate-limited (5 attempts / 15 min per IP)
5. **Push Notifications**: Requires VAPID keys (`npx web-push generate-vapid-keys`)
6. **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

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
