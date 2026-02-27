import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { messages } from './schema';

const dbPath = process.env.TURSO_DATABASE_URL || 'file:sms.db';
const dbToken = process.env.TURSO_AUTH_TOKEN;

// Initialize Turso client
const client = createClient({
    url: dbPath,
    authToken: dbToken
});

// Initialize Drizzle ORM with client
const db = drizzle({ client });

// Database schema type exports
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

// Helper functions using raw SQL for compatibility
export async function addMessage(subject: string, messageText: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const result = await client.execute({
        sql: 'INSERT INTO messages (subject, message, created_at) VALUES (?, ?, ?)',
        args: [subject, messageText, timestamp]
    });

    // Get the inserted row
    const inserted = await client.execute({
        sql: 'SELECT * FROM messages WHERE id = ?',
        args: [result.lastInsertRowid || 0]
    });

    return inserted.rows[0];
}

export async function getMessageById(id: number) {
    const result = await client.execute({
        sql: 'SELECT * FROM messages WHERE id = ?',
        args: [id]
    });
    return result.rows[0];
}

export async function getAllMessages(limit: number = 100, offset: number = 0) {
    const result = await client.execute({
        sql: 'SELECT * FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?',
        args: [limit, offset]
    });
    return result.rows;
}

export async function deleteMessage(id: number) {
    const result = await client.execute({
        sql: 'DELETE FROM messages WHERE id = ?',
        args: [id]
    });
    // Check if any row was deleted by checking the result
    return result.rowsAffected !== undefined ? result.rowsAffected > 0 : true;
}

export async function getMessageCount() {
    const result = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM messages',
        args: []
    });
    return result.rows[0]?.count || 0;
}
