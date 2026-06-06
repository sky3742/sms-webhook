"use server";

import { db } from "@/lib/repo/db";
import { messages } from "@/lib/repo/schema";
import { getSession } from "@/lib/services/auth";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteMessage(id: number) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = await db.delete(messages).where(eq(messages.id, id));
  revalidatePath("/");
  return result.rowsAffected !== undefined ? result.rowsAffected > 0 : true;
}

export async function loadMessages(page: number, pageSize: number = 5) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const offset = page * pageSize;
  const result = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .limit(pageSize)
    .offset(offset);
  return result;
}
