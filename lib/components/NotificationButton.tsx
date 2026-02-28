"use client";

import { useNotificationStatus } from "@/lib/stores/notification";
import { usePushNotifications } from "../utils/notifications";

export const NotificationButton = () => {
  const { loading, permission, supported } = useNotificationStatus();

  const { handleEnableNotifications, handleSendTestNotification } =
    usePushNotifications();

  if (!supported) {
    return null;
  }

  if (permission === "granted") {
    return (
      <button
        onClick={handleSendTestNotification}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base whitespace-nowrap"
      >
        Test Notification
      </button>
    );
  }

  return (
    <button
      onClick={handleEnableNotifications}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Subscribing..." : "Enable Notifications"}
    </button>
  );
};
