"use client";

import { useNotificationStatus } from "@/lib/stores/notification";
import { useMemo } from "react";

export const NotificationStatusAnnoucement = () => {
  const { subscribed, permission, supported, loading } =
    useNotificationStatus();

  // Get notification status
  const status = useMemo(() => {
    if (loading) {
      return {
        message: "Loading notification status...",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        icon: "⏳",
      };
    }

    if (!supported) {
      return {
        message: "Push notifications are not supported in this browser",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        icon: "ℹ️",
      };
    }

    if (subscribed) {
      return {
        message:
          "Notifications are enabled - you will receive alerts for new SMS messages",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        icon: "✓",
      };
    }

    if (permission === "default") {
      return {
        message:
          "Enable push notifications to receive alerts for new SMS messages",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
        icon: "🔔",
      };
    }

    if (permission === "granted") {
      return {
        message: "Notifications are enabled but not subscribed to server push",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
        icon: "🔔",
      };
    }

    return {
      message: "Notifications are disabled",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      icon: "✗",
    };
  }, [loading, supported, subscribed, permission]);

  if (loading) {
    return null;
  }

  return (
    <div
      className={`mb-6 p-4 rounded-lg border ${status.bgColor} ${status.textColor}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{status.icon}</span>
        <p className="text-sm sm:text-base">{status.message}</p>
      </div>
    </div>
  );
};
