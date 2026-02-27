import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
    console.error('❌ TURSO_DATABASE_URL is not set in .env.local');
    process.exit(1);
}

console.log('Migrating to Turso database...');
console.log('Database URL:', tursoUrl);

const client = createClient({
    url: tursoUrl,
    authToken: tursoToken
});

async function migrate() {
    try {
        // Create messages table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
            )
        `);
        console.log('✅ Created messages table');

        // Create index
        await client.execute(`
            CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC)
        `);
        console.log('✅ Created index idx_messages_created_at');

        console.log('✅ Migration completed successfully!');
        console.log('Database:', tursoUrl);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

migrate();
