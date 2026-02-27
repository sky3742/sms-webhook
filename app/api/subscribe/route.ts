import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotificationToAll } from '@/lib/push-notifications';

// In-memory storage for subscriptions (use database in production)
export const subscriptions = new Set<string>();

/**
 * Subscribe to push notifications
 */
export async function POST(request: NextRequest) {
    try {
        const subscription = await request.json();

        // Store subscription (in production, save to database)
        subscriptions.add(JSON.stringify(subscription));

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

        // Remove subscription from storage
        subscriptions.delete(JSON.stringify(subscription));

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
 * Send test push notification
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const test = searchParams.get('test') === 'true';

        if (test) {
            // Send test notification to all subscribers
            const payload = {
                title: 'Test Push Notification',
                body: 'This is a test notification from SMS Webhook Dashboard',
                icon: '/icon-192.png',
                badge: '/icon-192.png'
            };

            const count = await sendPushNotificationToAll(
                Array.from(subscriptions).map(sub => JSON.parse(sub)),
                payload
            );

            return NextResponse.json({
                success: true,
                sent_to: count,
                message: `Test notification sent to ${count} subscriber(s)`
            });
        }

        return NextResponse.json({
            success: true,
            subscriber_count: subscriptions.size
        });

    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json(
            { error: 'Failed to get subscription info' },
            { status: 500 }
        );
    }
}
