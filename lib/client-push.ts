// Client-side push notification subscription
export async function subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported');
        return null;
    }

    try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');

        // Convert VAPID key from base64 to Uint8Array
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
        const applicationServerKey = urlBase64ToUint8Array(vapidKey);

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey as BufferSource
        });
        console.log('Push subscription created');

        // Send subscription to server
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });

        if (!response.ok) {
            throw new Error('Failed to subscribe');
        }

        console.log('Successfully subscribed to push notifications');
        return subscription;

    } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
        return null;
    }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();

            // Send unsubscription to server
            await fetch('/api/subscribe', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscription)
            });

            console.log('Successfully unsubscribed from push notifications');
        }
    } catch (error) {
        console.error('Failed to unsubscribe:', error);
    }
}

/**
 * Check if notifications are supported and permission status
 */
export function getNotificationStatus() {
    if (!('PushManager' in window)) {
        return {
            supported: false,
            permission: 'unsupported' as const
        };
    }

    return {
        supported: true,
        permission: Notification.permission as 'default' | 'granted' | 'denied'
    };
}

/**
 * Convert base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
