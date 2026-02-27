import { NextRequest, NextResponse } from 'next/server';
import { addMessage, getMessageCount } from '@/lib/db';
import { parseSmsMessage, formatPhoneNumber } from '@/lib/sms-parser';
import { sendPushNotificationToAll } from '@/lib/push-notifications';
import { createClient } from '@libsql/client';

const dbPath = process.env.TURSO_DATABASE_URL || 'file:sms.db';
const dbToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
    url: dbPath,
    authToken: dbToken
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.subject || !body.message) {
            return NextResponse.json(
                { error: 'Missing required fields: subject and message' },
                { status: 400 }
            );
        }

        // Parse message using SMS Forwarder parser
        const parsed = parseSmsMessage(body);
        const formattedSender = formatPhoneNumber(parsed.sender);

        // Save message to database with formatted phone number
        const message = await addMessage(formattedSender, parsed.content);

        // Get all subscriptions from database
        const result = await client.execute({
            sql: `SELECT * FROM push_subscriptions`,
            args: []
        });

        const subscriptions = result.rows.map((row: any) => ({
            endpoint: row.endpoint,
            keys: {
                p256dh: row.p256dh,
                auth: row.auth
            }
        }));

        // Send push notification to all subscribers
        const payload = {
            title: `New SMS from ${formattedSender}`,
            body: parsed.content,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            data: {
                url: '/',
                messageId: message.id
            }
        };

        const sentCount = await sendPushNotificationToAll(subscriptions, payload);

        console.log(`Push notification sent to ${sentCount} subscriber(s)`);

        return NextResponse.json({
            success: true,
            message_id: message.id,
            timestamp: message.created_at,
            sender: formattedSender,
            notifications_sent: sentCount
        }, { status: 200 });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    const count = await getMessageCount();

    return NextResponse.json({
        status: 'ok',
        message_count: count,
        timestamp: Date.now()
    });
}
