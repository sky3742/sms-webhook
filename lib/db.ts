import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const dbPath = process.env.TURSO_DATABASE_URL || 'file:sms.db';

// Initialize Turso/SQLite client
const client = createClient({
    url: dbPath
});

// Initialize Drizzle ORM
export const db = drizzle(client, { schema });

// Database schema type exports
export type Message = typeof schema.messages.$inferSelect;
export type NewMessage = typeof schema.messages.$inferInsert;

// Helper functions using Drizzle
export async function addMessage(subject: string, message: string) {
    const newMessage = await db.insert(schema.messages).values({
        subject,
        message,
        createdAt: Date.now()
    }).returning();

    return newMessage[0];
}

export async function getMessageById(id: number) {
    const result = await db.select().from(schema.messages).where(
        // @ts-ignore - SQLite specific
        schema.messages.id.equals(id)
    );
    return result[0];
}

export async function getAllMessages(limit: number = 100, offset: number = 0) {
    return await db.select().from(schema.messages)
        .orderBy(schema.messages.createdAt)
        .limit(limit)
        .offset(offset);
}

export async function deleteMessage(id: number) {
    const result = await db.delete(schema.messages).where(
        // @ts-ignore - SQLite specific
        schema.messages.id.equals(id)
    );
    return result.changes > 0;
}

export async function getMessageCount() {
    const result = await db.select({ count: schema.messages.id }).from(schema.messages);
    return result.length;
}
