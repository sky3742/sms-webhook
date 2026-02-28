"use client";

import { useNotificationStatus } from "@/lib/stores/notification";
import { usePushNotifications } from "@/lib/utils/notifications";
import { useSyncExternalStore } from "react";

type NotificationButtonBaseProps = {
  onClick: () => void;
  label: string;
  className: string;
  disabled?: boolean;
};

const NotificationButtonBase = ({
  onClick,
  label,
  className,
  disabled = false,
}: NotificationButtonBaseProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded-lg px-4 py-2 text-sm whitespace-nowrap text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:text-base ${className}`}
  >
    {label}
  </button>
);

const TestNotificationButton = ({ onClick }: { onClick: () => void }) => (
  <NotificationButtonBase
    onClick={onClick}
    label="Test Notification"
    className="bg-purple-600 hover:bg-purple-700"
  />
);

const EnableNotificationButton = ({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) => (
  <NotificationButtonBase
    onClick={onClick}
    label={loading ? "Subscribing..." : "Enable Notifications"}
    className="bg-green-600 hover:bg-green-700"
    disabled={loading}
  />
);

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

  if (permission === "granted") {
    return <TestNotificationButton onClick={handleSendTestNotification} />;
  }

  return (
    <EnableNotificationButton
      onClick={handleEnableNotifications}
      loading={loading}
    />
  );
};
