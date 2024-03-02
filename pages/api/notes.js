import { getNotesByUserId, createNote, updateNote } from '../../utils/db';
const crypto = require('crypto');

export default async function handler(req, res) {
  const userId = req.headers.userid;

  if (req.method === 'GET') {
    const notes = await getNotesByUserId(userId);
    res.status(200).json(notes);
  } else if (req.method === 'PUT') {
    const { title, content } = req.body;
    const note = await createNote(userId, title, content);
    res.status(200).json({ id: note });
  }
}