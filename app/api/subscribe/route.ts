import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { sendPushNotificationToAll } from '@/lib/push-notifications';

const dbPath = process.env.TURSO_DATABASE_URL || 'file:sms.db';
const dbToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
    url: dbPath,
    authToken: dbToken
});

/**
 * Subscribe to push notifications
 */
export async function POST(request: NextRequest) {
    try {
        const subscription = await request.json();

        const endpoint = subscription.endpoint;
        const p256dh = subscription.keys?.p256dh || '';
        const auth = subscription.keys?.auth || '';

        // Store subscription in database
        await client.execute({
            sql: `INSERT OR REPLACE INTO push_subscriptions (endpoint, p256dh, auth, created_at) VALUES (?, ?, ?, ?)`,
            args: [endpoint, p256dh, auth, Math.floor(Date.now() / 1000)]
        });

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to notifications'
        }, { status: 200 });

    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
}

/**
 * Unsubscribe from push notifications
 */
export async function DELETE(request: NextRequest) {
    try {
        const subscription = await request.json();

        const endpoint = subscription.endpoint;

        // Remove subscription from database
        await client.execute({
            sql: `DELETE FROM push_subscriptions WHERE endpoint = ?`,
            args: [endpoint]
        });

        return NextResponse.json({
            success: true,
            message: 'Successfully unsubscribed'
        }, { status: 200 });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json(
            { error: 'Failed to unsubscribe' },
            { status: 500 }
        );
    }
}

/**
 * Get subscription info and send test notification
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const test = searchParams.get('test') === 'true';

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

        if (test) {
            const payload = {
                title: 'Test Push Notification',
                body: 'This is a test notification from SMS Webhook Dashboard',
                icon: '/icon-192.png',
                badge: '/icon-192.png'
            };

            const count = await sendPushNotificationToAll(subscriptions, payload);

            return NextResponse.json({
                success: true,
                sent_to: count,
                message: `Test notification sent to ${count} subscriber(s)`
            });
        }

        return NextResponse.json({
            success: true,
            subscriber_count: subscriptions.length
        });

    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json(
            { error: 'Failed to get subscription info' },
            { status: 500 }
        );
    }
}
