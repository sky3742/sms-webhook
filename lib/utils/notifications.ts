import { useNotificationStatus } from "@/lib/stores/notification";
import { subscribeToPushNotifications } from "@/lib/utils/client-push";
import { useCallback, useEffect } from "react";

export const usePushNotifications = () => {
  const { permission, subscribed, setIsLoading, setStatus, setSubscribed } =
    useNotificationStatus();

  const subscribeIfNeeded = useCallback(async () => {
    if (permission !== "granted" || subscribed) {
      return;
    }

    setIsLoading(true);
    try {
      const subscription = await subscribeToPushNotifications();
      setSubscribed(Boolean(subscription));
    } finally {
      setIsLoading(false);
    }
  }, [permission, subscribed, setIsLoading, setSubscribed]);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      setIsLoading(false);
      return;
    }

    setStatus(Notification.permission);
    setIsLoading(false);
  }, [setStatus, setIsLoading]);

  useEffect(() => {
    void subscribeIfNeeded();
  }, [subscribeIfNeeded]);

  const handleEnableNotifications = async () => {
    if (permission !== "default") {
      return;
    }

    setIsLoading(true);
    try {
      const nextPermission = await Notification.requestPermission();
      setStatus(nextPermission);
      if (nextPermission !== "granted") {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      setIsLoading(false);
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
