"use server";

import { db } from "@/lib/repo/db";
import { pushSubscriptions } from "@/lib/repo/schema";
import { InferInsertModel } from "drizzle-orm";

export const saveSubscription = async (
  value: InferInsertModel<typeof pushSubscriptions>,
) => {
  await db.insert(pushSubscriptions).values(value).onConflictDoUpdate({
    target: pushSubscriptions.endpoint,
    set: value,
  });
};
