import { db } from "@/lib/repo/db";
import { pushSubscriptions } from "@/lib/repo/schema";
import { eq } from "drizzle-orm";

const MAX_SUBSCRIPTIONS = 100;

export const deleteSubscription = async (endpoint: string) => {
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
};

export const getAllSubscriptions = async () =>
  db.select().from(pushSubscriptions).limit(MAX_SUBSCRIPTIONS);
