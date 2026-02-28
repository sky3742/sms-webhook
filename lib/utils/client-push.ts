import { saveSubscription } from "@/lib/services/pushSubscription";

// Client-side push notification subscription
export async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
    if (!vapidKey) {
      throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing");
    }
    const applicationServerKey = urlBase64ToUint8Array(vapidKey);

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });

    // Send subscription to server
    const sub = subscription.toJSON();
    await saveSubscription({
      endpoint: subscription.endpoint,
      p256dh: sub.keys?.["p256dh"] || "",
      auth: sub.keys?.["auth"] || "",
      createdAt: Math.floor(Date.now() / 1000),
    });

    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    return null;
  }
}

/**
 * Convert base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
