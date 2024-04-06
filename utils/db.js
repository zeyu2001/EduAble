import { sql } from '@vercel/postgres';
const crypto = require('crypto');

const getUserByUsername = async (username) => {
  const user = await sql`SELECT * FROM "user" WHERE username = ${username}`
  return user.rows[0];
}

const getUserById = async (id) => {
  const user = await sql`SELECT * FROM "user" WHERE id = ${id}`
  return user.rows[0];
}

const createUser = async (username, password) => {
  const uuid = crypto.randomUUID();
  await sql`INSERT INTO "user" (id, username, password) VALUES (${uuid}, ${username}, ${crypto.createHash("sha256").update(password).digest("hex")})`;
  return uuid;
}

const getNotesByUserId = async (userId) => {
  const notes = await sql`SELECT * FROM note WHERE user_id = ${userId} ORDER BY last_updated DESC`;
  return notes.rows;
}

const createNote = async (userId, title, content) => {
  const uuid = crypto.randomUUID();
  await sql`INSERT INTO note (id, user_id, title, content) VALUES (${uuid}, ${userId}, ${title}, ${content})`;
  return uuid;
}

const updateNote = async (noteId, title, content) => {
  await sql`UPDATE note SET title = ${title}, content = ${content}, last_updated = CURRENT_TIMESTAMP WHERE id = ${noteId}`;
}

const getNoteByNoteId = async (noteId) => {
  const note = await sql`SELECT * FROM note WHERE id = ${noteId}`;
  return note.rows[0];
}

const getSummaryByNoteId = async (noteId) => {
  const summary = await sql`SELECT * FROM summary WHERE note_id = ${noteId}`;
  return summary.rows[0];
}

const createSummary = async (noteId, content) => {
  const uuid = crypto.randomUUID();
  await sql`INSERT INTO summary (id, note_id, content) VALUES (${uuid}, ${noteId}, ${content})`;
  return uuid;
}

const updateSummary = async (noteId, content) => {
  await sql`UPDATE summary SET content = ${content} WHERE note_id = ${noteId}`;
}

const verifyPassword = async (username, password) => {
  const user = await getUserByUsername(username);
  if (user && user.password === crypto.createHash("sha256").update(password).digest("hex")) {
    return user.id;
  } else {
    return null;
  }
}

export { 
  getUserByUsername, getUserById, createUser, verifyPassword,
  getNotesByUserId, createNote, updateNote, getNoteByNoteId, 
  getSummaryByNoteId, createSummary, updateSummary
};