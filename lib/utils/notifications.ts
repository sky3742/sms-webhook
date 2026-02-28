import { useNotificationStatus } from "@/lib/stores/notification";
import { useCallback, useEffect } from "react";
import { subscribeToPushNotifications } from "./client-push";

export const usePushNotifications = () => {
  const { permission, subscribed, setIsLoading, setStatus, setSubscribed } =
    useNotificationStatus();

  const subscibe = useCallback(async () => {
    if (permission === "granted" && !subscribed) {
      const subscription = await subscribeToPushNotifications();
      setSubscribed(!!subscription);
      setIsLoading(false);
    }
  }, [permission, subscribed, setIsLoading, setSubscribed]);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
    } else {
      setStatus(Notification.permission);
    }
  }, [setStatus]);

  useEffect(() => {
    subscibe();
  }, [subscibe]);

  const handleEnableNotifications = async () => {
    try {
      if (permission === "default") {
        await Notification.requestPermission();
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    }
  };

  const handleSendTestNotification = () => {
    if (permission === "granted") {
      new Notification("Test SMS", {
        body: "This is a test notification from SMS Webhook Dashboard",
        icon: "/icon-192.png",
      });
    } else {
      alert("Please enable notifications first.");
    }
  };

  return {
    handleEnableNotifications,
    handleSendTestNotification,
  };
};
