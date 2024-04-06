import { sql } from '@vercel/postgres';

await sql`DROP TABLE IF EXISTS "summary"`;
await sql`DROP TABLE IF EXISTS "note"`;
await sql`DROP TABLE IF EXISTS "user"`;

await sql`CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY, 
  username TEXT, 
  password TEXT
);`

await sql`CREATE TABLE IF NOT EXISTS "note" (
  id TEXT PRIMARY KEY, 
  user_id TEXT, 
  title TEXT, 
  content TEXT, 
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user" (id)
);`

await sql`CREATE TABLE IF NOT EXISTS "summary" (
  id TEXT PRIMARY KEY, 
  note_id TEXT, 
  content TEXT, 
  FOREIGN KEY (note_id) REFERENCES "note" (id)
);`

await sql`INSERT INTO "user" (id, username, password) VALUES ('af7c1fe6-d669-414e-b066-e9733f0de7a8', 'CHATGPT', 'CHATGPT');`