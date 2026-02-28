"use server";

import webpush from "web-push";

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "";

webpush.setVapidDetails(
  "mailto:skyblue3742@gmail.com",
  publicVapidKey,
  privateVapidKey,
);

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: unknown;
}

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushNotificationPayload,
): Promise<void> {
  if (!publicVapidKey || !privateVapidKey) {
    console.warn("VAPID keys not configured");
    return;
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to send push notification:", error);
    throw error;
  }
}

export async function sendPushNotificationToAll(
  subscriptions: PushSubscription[],
  payload: PushNotificationPayload,
): Promise<number> {
  let successCount = 0;

  for (const subscription of subscriptions) {
    try {
      await sendPushNotification(subscription, payload);
      successCount++;
    } catch (error) {
      console.error("Failed to send to subscription:", error);
    }
  }

  return successCount;
}
