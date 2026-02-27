'use client';

import { useState, useEffect } from 'react';
import { usePushNotifications } from '@/lib/notifications';

export default function Dashboard() {
    const [messages, setMessages] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showNotificationBtn, setShowNotificationBtn] = useState(false);

    const { isSupported, permission, requestPermission, sendNotification } =
        usePushNotifications();

    const loadMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/messages?limit=50');
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            setMessages(data.messages);
            setCount(data.count);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error('Error loading messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();

        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }, []);

    const handleRefresh = () => {
        loadMessages();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const response = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete message');
            loadMessages();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete message');
        }
    };

    const handleNotificationPermission = async () => {
        const granted = await requestPermission();
        if (granted) {
            alert('Notifications enabled! You will receive alerts for new SMS messages.');
        } else {
            alert('Notifications disabled.');
        }
    };

    const handleSendTestNotification = () => {
        if (isSupported && permission === 'granted') {
            sendNotification({
                id: Date.now(),
                subject: 'Test SMS',
                message: 'This is a test notification!'
            });
        } else {
            alert('Please enable notifications first.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                {/* Header with Refresh Button */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            SMS Webhook Dashboard
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Total messages received: {count}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>

                        {isSupported && permission === 'default' && (
                            <button
                                onClick={handleNotificationPermission}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base whitespace-nowrap"
                            >
                                Enable Notifications
                            </button>
                        )}

                        {isSupported && permission === 'granted' && (
                            <button
                                onClick={handleSendTestNotification}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base whitespace-nowrap"
                            >
                                Test Notification
                            </button>
                        )}
                    </div>
                </div>

                {/* Messages List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {error && (
                        <div className="p-4 text-center text-red-500 text-sm sm:text-base">
                            Error: {error}
                        </div>
                    )}

                    {messages.length === 0 && !loading ? (
                        <div className="p-8 text-center text-gray-500 text-sm sm:text-base">
                            No messages received yet
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {messages.map((msg) => (
                                <div key={msg.id} className="p-4 sm:p-6 hover:bg-gray-50">
                                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Subject */}
                                            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                                {msg.subject || 'No subject'}
                                            </h2>

                                            {/* Message */}
                                            <p className="text-sm sm:text-base text-gray-700 mt-1 sm:mt-2 whitespace-pre-wrap break-words">
                                                {msg.message}
                                            </p>

                                            {/* Timestamp */}
                                            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-3">
                                                Received at: {new Date(msg.created_at * 1000).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Message ID & Actions */}
                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <div className="text-xs sm:text-sm text-gray-400">
                                                #{msg.id}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors whitespace-nowrap"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* API Endpoint Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                        Webhook Endpoint
                    </h3>
                    <code className="text-xs sm:text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
                        POST /api/webhook
                    </code>
                    <p className="text-xs sm:text-sm text-blue-700 mt-2">
                        SMS Forwarder sends:{' '}
                        <code className="bg-blue-100 px-1 rounded">
                            {JSON.stringify({ subject: "Example", message: "Hello" })}
                        </code>
                    </p>
                </div>

                {/* Notification Status */}
                {isSupported && permission !== 'default' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                            ✓ Notifications are {permission === 'granted' ? 'enabled' : 'disabled'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
