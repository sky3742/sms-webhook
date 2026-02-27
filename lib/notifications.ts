// Push Notification Hook
'use client';

import { useState, useEffect } from 'react';

export interface PushNotificationMessage {
    id: number;
    subject: string;
    message: string;
}

export function usePushNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!isSupported) {
            alert('Push notifications are not supported in this browser');
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    };

    const sendNotification = (message: PushNotificationMessage) => {
        if (!isSupported) {
            console.warn('Push notifications not supported');
            return;
        }

        if (permission !== 'granted') {
            console.warn('Notification permission not granted');
            return;
        }

        try {
            const notification = new Notification(message.subject || 'New SMS', {
                body: message.message,
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                data: {
                    url: '/',
                    messageId: message.id
                }
            });

            notification.onclick = (event) => {
                event.preventDefault();
                window.focus();
                notification.close();
            };

            return notification;
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    return {
        isSupported,
        permission,
        requestPermission,
        sendNotification
    };
}
