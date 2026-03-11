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
    className={`w-full py-3 bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {label}
  </button>
);

const TestNotificationButton = ({ onClick }: { onClick: () => void }) => (
  <NotificationButtonBase
    onClick={onClick}
    label="Test Notification"
    className="hover:bg-indigo-700"
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
    className="hover:bg-indigo-700"
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
