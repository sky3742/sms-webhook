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

export const getAllSubscriptions = async () => {
  return await db.select().from(pushSubscriptions);
};

export const getSubscription = async (endpoint: string) => {
  const result = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));

  return result.at(0);
};
