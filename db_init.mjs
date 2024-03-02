import { sql } from '@vercel/postgres';

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
  FOREIGN KEY (user_id) REFERENCES "user" (id)
);`