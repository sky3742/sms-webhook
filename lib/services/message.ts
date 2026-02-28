"use server";

import { db } from "@/lib/repo/db";
import { messages } from "@/lib/repo/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper functions using raw SQL for compatibility
export async function addMessage(subject: string, messageText: string) {
  const timestamp = Math.floor(Date.now() / 1000);

  const result = await db
    .insert(messages)
    .values({
      subject,
      message: messageText,
      createdAt: timestamp,
    })
    .returning();

  return result.at(0)!;
}

export async function getMessageById(id: number) {
  const result = await db.select().from(messages).where(eq(messages.id, id));
  return result.at(0);
}

export async function getAllMessages(limit: number = 100, offset: number = 0) {
  const result = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .offset(offset);
  return result;
}

export async function deleteMessage(id: number) {
  const result = await db.delete(messages).where(eq(messages.id, id));
  revalidatePath("/");
  return result.rowsAffected !== undefined ? result.rowsAffected > 0 : true;
}

export async function getMessageCount() {
  const result = await db.$count(messages);
  return result;
}
