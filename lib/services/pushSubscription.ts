import { db } from "@/lib/repo/db";
import { pushSubscriptions } from "@/lib/repo/schema";
import { eq } from "drizzle-orm";

export const deleteSubscription = async (endpoint: string) => {
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
};

export const getAllSubscriptions = async () =>
  db.select().from(pushSubscriptions);
