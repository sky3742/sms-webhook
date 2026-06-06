"use client";

import { useNotificationStatus } from "@/lib/stores/notification";
import { usePushNotifications } from "@/lib/utils/notifications";
import { useSyncExternalStore } from "react";

export const NotificationButton = () => {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { loading, permission, supported } = useNotificationStatus();
  const { handleEnableNotifications, handleSendTestNotification } =
    usePushNotifications();

  if (!mounted || !supported) {
    return null;
  }

  const isEnabled = permission === "granted";

  return (
    <button
      className="text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={loading}
      onClick={isEnabled ? handleSendTestNotification : handleEnableNotifications}
      title={isEnabled ? "Test notification" : "Enable notifications"}
      aria-label={isEnabled ? "Test notification" : "Enable notifications"}
      type="button"
    >
      {loading ? (
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )}
    </button>
  );
};
