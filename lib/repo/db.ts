import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const dbPath = process.env.TURSO_DATABASE_URL || "file:sms.db";
const dbToken = process.env.TURSO_AUTH_TOKEN;

// Initialize Turso client
const client = createClient({
  url: dbPath,
  authToken: dbToken,
});

// Initialize Drizzle ORM with client
export const db = drizzle({ client });
