import { createClient } from '@libsql/client';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sms.db');

// Initialize Turso/SQLite client
const db = createClient({
    url: `file:${dbPath}`
});

// Initialize schema
db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
`);

export interface Message {
    id: number;
    subject: string;
    message: string;
    created_at: number;
}

export function addMessage(subject: string, message: string): Message {
    const stmt = db.prepare('INSERT INTO messages (subject, message) VALUES (?, ?)');
    const result = stmt.run(subject, message);
    return getMessageById(result.lastInsertRowid as number);
}

export function getMessageById(id: number): Message | undefined {
    const stmt = db.prepare('SELECT * FROM messages WHERE id = ?');
    return stmt.get(id) as Message | undefined;
}

export function getAllMessages(limit: number = 100, offset: number = 0): Message[] {
    const stmt = db.prepare('SELECT * FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(limit, offset) as Message[];
}

export function deleteMessage(id: number): boolean {
    const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

export function getMessageCount(): number {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM messages');
    return (stmt.get() as { count: number }).count;
}
