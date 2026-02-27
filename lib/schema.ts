import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const messages = sqliteTable('messages', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    createdAt: integer('created_at').notNull().$defaultFn(() => Date.now())
});
