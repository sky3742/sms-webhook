# Deployment Guide

## Environment Variables

Create a `.env.local` file in the project root with these variables:

```bash
# Turso Database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# VAPID Keys for Push Notifications
# Run `npx web-push generate-vapid-keys` locally and copy the generated public/private pair.
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
```

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment Variables in Vercel Dashboard:**

1. Go to Vercel project settings
2. Add environment variables:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`

### Option 2: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

### Option 3: Render

```bash
# Push to GitHub
git push

# Deploy on Render
# Or use: render deploy
```

### Option 4: Docker

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
docker run -p 3000:3000 --env-file .env.local sms-webhook
```

## SMS Forwarder Configuration

Set the webhook URL in SMS Forwarder to:

```
https://your-app.vercel.app/api/webhook
```

## Database Backup

To backup your Turso database:

```bash
npx drizzle-kit push --config=drizzle.config.ts
```

## Monitoring

Check the server logs for push notification status:

- Success: `Push notification sent to N subscriber(s)`
- Error: Check console logs for details

## Troubleshooting

### Push notifications not working

1. Check `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` are configured correctly
2. Verify client has granted notification permission
3. Check browser console for errors
4. Ensure service worker is registered

### Database connection errors

1. Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are correct
2. Check Turso database is active
3. Verify database URL format: `libsql://your-db.turso.io`

### Webhook not receiving messages

1. Verify webhook URL is correct
2. Check server is running
3. Verify SMS Forwarder is sending data in correct format
