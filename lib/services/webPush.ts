"use server";

import { deleteSubscription } from "@/lib/services/pushSubscription";
import webpush from "web-push";

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "";

const contactEmail = process.env.VAPID_CONTACT_EMAIL || "noreply@example.com";

webpush.setVapidDetails(
  `mailto:${contactEmail}`,
  publicVapidKey,
  privateVapidKey,
);

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: unknown;
}

const BATCH_SIZE = 10;

export async function sendPushNotificationToAll(
  subscriptions: PushSubscription[],
  payload: PushNotificationPayload,
): Promise<number> {
  if (!publicVapidKey || !privateVapidKey) {
    console.warn("VAPID keys not configured");
    return 0;
  }

  let successCount = 0;
  const staleEndpoints: string[] = [];

  for (let i = 0; i < subscriptions.length; i += BATCH_SIZE) {
    const batch = subscriptions.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((sub) =>
        webpush.sendNotification(sub, JSON.stringify(payload)),
      ),
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === "fulfilled") {
        successCount++;
      } else {
        const status = (result.reason as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          staleEndpoints.push(batch[j].endpoint);
        } else {
          console.error("Push notification failed:", result.reason);
        }
      }
    }
  }

  for (const endpoint of staleEndpoints) {
    try {
      await deleteSubscription(endpoint);
    } catch {
      // Ignore cleanup errors
    }
  }

  if (staleEndpoints.length > 0) {
    console.log(`Clean up ${staleEndpoints.length} stale push subscription(s)`);
  }

  return successCount;
}
