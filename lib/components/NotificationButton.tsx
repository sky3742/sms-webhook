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
    className="bg-[#0b7a75] hover:bg-[#086560]"
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
    className="bg-[#15803d] hover:bg-[#11632f]"
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
