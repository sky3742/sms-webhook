// Server-side Push Notifications using Web Push API
import webpush from 'web-push';

// Use NEXT_PUBLIC_VAPID_PUBLIC_KEY for both client and server
const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

// Initialize web-push (private key is optional for VAPID verification)
// If you have a private key, you can add it here:
// const privateVapidKey = process.env.VAPID_PRIVATE_KEY || '';

webpush.setVapidDetails(
    'mailto:sky@example.com',
    publicVapidKey
);

export interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface PushNotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
}

/**
 * Send push notification to a single subscription
 */
export async function sendPushNotification(
    subscription: PushSubscription,
    payload: PushNotificationPayload
): Promise<void> {
    if (!publicVapidKey) {
        console.warn('VAPID public key not configured');
        return;
    }

    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
        console.error('Failed to send push notification:', error);
        // Subscription might be expired, remove it
        throw error;
    }
}

/**
 * Send push notification to multiple subscriptions
 */
export async function sendPushNotificationToAll(
    subscriptions: PushSubscription[],
    payload: PushNotificationPayload
): Promise<number> {
    let successCount = 0;

    for (const subscription of subscriptions) {
        try {
            await sendPushNotification(subscription, payload);
            successCount++;
        } catch (error) {
            console.error('Failed to send to subscription:', error);
        }
    }

    return successCount;
}

/**
 * Send SMS webhook notification
 */
export async function sendSmsWebhookNotification(
    subscription: PushSubscription,
    message: {
        subject: string;
        content: string;
    }
): Promise<void> {
    const payload: PushNotificationPayload = {
        title: `New SMS from ${message.subject}`,
        body: message.content,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: {
            url: '/',
            messageId: Date.now()
        }
    };

    await sendPushNotification(subscription, payload);
}
