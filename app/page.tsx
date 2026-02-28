"use client";

import {
  getNotificationStatus,
  subscribeToPushNotifications,
} from "@/lib/client-push";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<any>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/messages?limit=50");
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.messages);
      setCount(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    console.log("=== Dashboard mounted, checking notification status ===");

    // Check notification status
    const status = getNotificationStatus();
    console.log("Notification status:", status);
    setNotificationStatus(status);

    // Check if already subscribed
    checkExistingSubscription();

    // Subscribe to push notifications
    if (status.supported && status.permission === "default") {
      console.log("Permission is default, subscribing...");
      subscribeToPushNotifications()
        .then((subscription) => {
          console.log("Subscription result:", subscription);
          if (subscription) {
            setSubscribed(true);
            console.log("Set subscribed to true");
          }
        })
        .catch((error) => {
          console.error("Failed to subscribe:", error);
        });
    } else {
      console.log("Permission is not default:", status.permission);
    }
  }, []);

  const checkExistingSubscription = async () => {
    try {
      console.log("Checking existing subscription...");
      const response = await fetch("/api/subscribe");
      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Subscription data:", data);
        setSubscribed(data.subscriber_count > 0);
        console.log("Set subscribed to:", data.subscriber_count > 0);
      } else {
        console.error("Failed to check subscription, status:", response.status);
      }
    } catch (error) {
      console.error("Failed to check subscription:", error);
    }
  };

  const handleRefresh = () => {
    loadMessages();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`/api/messages?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete message");
      loadMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete message");
    }
  };

  const handleEnableNotifications = async () => {
    if (isSubscribing) return;

    setIsSubscribing(true);

    try {
      // Request notification permission
      if (Notification.permission === "default") {
        console.log("Requesting notification permission...");
        const permission = await Notification.requestPermission();
        console.log("Permission granted:", permission);

        if (permission === "granted") {
          console.log("Permission granted, subscribing...");
          // Subscribe to push notifications
          const subscription = await subscribeToPushNotifications();
          console.log("Subscription result:", subscription);
          if (subscription) {
            setSubscribed(true);
            console.log("Set subscribed to true");
          }
        }
      } else if (Notification.permission === "granted") {
        console.log("Permission already granted, checking subscription...");
        // Already granted, just check subscription
        const response = await fetch("/api/subscribe");
        if (response.ok) {
          const data = await response.json();
          setSubscribed(data.subscriber_count > 0);
          console.log("Set subscribed to:", data.subscriber_count > 0);
        }
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSendTestNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Test SMS", {
        body: "This is a test notification from SMS Webhook Dashboard",
        icon: "/icon-192.png",
      });
    } else {
      alert("Please enable notifications first.");
    }
  };

  // Get notification status
  const getStatus = () => {
    if (!notificationStatus) {
      return {
        message: "Loading notification status...",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        icon: "⏳",
      };
    }
    if (!notificationStatus.supported) {
      return {
        message: "Push notifications are not supported in this browser",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        icon: "ℹ️",
      };
    }
    if (notificationStatus.permission === "default") {
      return {
        message: subscribed
          ? "✓ Notifications enabled - you will receive alerts for new SMS messages"
          : "Enable push notifications to receive alerts for new SMS messages",
        bgColor: subscribed ? "bg-green-50" : "bg-yellow-50",
        textColor: subscribed ? "text-green-800" : "text-yellow-800",
        icon: subscribed ? "✓" : "🔔",
      };
    }
    if (notificationStatus.permission === "granted") {
      return {
        message: subscribed
          ? "Notifications are enabled - you will receive alerts for new SMS messages"
          : "Notifications are enabled but not subscribed to server push",
        bgColor: subscribed ? "bg-green-50" : "bg-yellow-50",
        textColor: subscribed ? "text-green-800" : "text-yellow-800",
        icon: subscribed ? "✓" : "🔔",
      };
    }
    return {
      message: "Notifications are disabled",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      icon: "✗",
    };
  };

  const status = getStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Notification Status Announcement */}
        <div
          className={`mb-6 p-4 rounded-lg border ${status.bgColor} ${status.textColor}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{status.icon}</span>
            <p className="text-sm sm:text-base">{status.message}</p>
          </div>
        </div>

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
              {loading ? "Loading..." : "Refresh"}
            </button>

            {notificationStatus?.supported &&
              notificationStatus.permission === "default" && (
                <button
                  onClick={handleEnableNotifications}
                  disabled={isSubscribing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? "Subscribing..." : "Enable Notifications"}
                </button>
              )}

            {notificationStatus?.supported &&
              notificationStatus.permission === "granted" && (
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
                        {msg.subject || "No subject"}
                      </h2>

                      {/* Message */}
                      <p className="text-sm sm:text-base text-gray-700 mt-1 sm:mt-2 whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>

                      {/* Timestamp */}
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-3">
                        Received at:{" "}
                        {new Date(msg.created_at * 1000).toLocaleString()}
                      </p>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete message"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
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
            SMS Forwarder sends:{" "}
            <code className="bg-blue-100 px-1 rounded">
              {JSON.stringify({ subject: "Example", message: "Hello" })}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
