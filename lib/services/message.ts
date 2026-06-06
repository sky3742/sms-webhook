import { db } from "@/lib/repo/db";
import { messages } from "@/lib/repo/schema";
import { desc } from "drizzle-orm";

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

export async function getAllMessages(limit: number = 100, offset: number = 0) {
  const result = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .offset(offset);
  return result;
}

export async function getMessageCount() {
  return db.$count(messages);
}
