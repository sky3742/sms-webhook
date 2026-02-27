import type { Config } from 'drizzle-kit';

const config: Config = {
    schema: './lib/schema.ts',
    out: './drizzle',
    driver: 'turso',
    dbUrl: process.env.TURSO_DATABASE_URL || 'file:sms.db'
};

export default config;
