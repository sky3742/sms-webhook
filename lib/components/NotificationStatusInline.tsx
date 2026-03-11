"use client";

import { useNotificationStatus } from "@/lib/stores/notification";
import { useSyncExternalStore } from "react";

export const NotificationStatusInline = () => {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { supported, permission, loading } = useNotificationStatus();

  if (!mounted) {
    return null;
  }

  let text = "Notifications Disabled";
  let dotClass = "bg-yellow-500";

  if (!supported) {
    text = "Notifications Unsupported";
    dotClass = "bg-gray-400";
  } else if (loading) {
    text = "Checking notifications";
    dotClass = "bg-gray-400";
  } else if (permission === "granted") {
    text = "Notifications Enabled";
    dotClass = "bg-green-500";
  } else if (permission === "denied") {
    text = "Notifications Blocked";
    dotClass = "bg-red-500";
  }

  return (
    <>
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span>{text}</span>
    </>
  );
};
