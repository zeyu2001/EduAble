import { getNotesByUserId, createNote, updateNote } from '@/utils/db';
const crypto = require('crypto');

export default async function handler(req, res) {
  const userId = req.headers.userid;

  if (req.method === 'GET') {
    const userNotes = await getNotesByUserId(userId);
    const note = userNotes.find(note => note.id === req.query.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(note);
  } else if (req.method === 'PUT') {
    const { title, content } = req.body;
    const noteId = req.query.id;
    const userNotes = await getNotesByUserId(userId);
    const note = userNotes.find(note => note.id === noteId);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await updateNote(noteId, title, content);

    res.status(200).json({ id: note.id });
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}