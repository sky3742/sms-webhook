"use server";

import { db } from "@/lib/repo/db";
import { pushSubscriptions } from "@/lib/repo/schema";
import { eq, InferInsertModel } from "drizzle-orm";

export const saveSubscription = async (
  value: InferInsertModel<typeof pushSubscriptions>,
) => {
  await db.insert(pushSubscriptions).values(value).onConflictDoUpdate({
    target: pushSubscriptions.endpoint,
    set: value,
  });
};

export const deleteSubscription = async (endpoint: string) => {
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
};

export const getAllSubscriptions = async () =>
  db.select().from(pushSubscriptions);
