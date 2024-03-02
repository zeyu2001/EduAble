import { getNotesByUserId, createNote, updateNote, getSummaryByNoteId, getNoteByNoteId, createSummary } from '@/utils/db';
import { makeQuiz } from '@/utils/openai';

export default async function handler(req, res) {
  const userId = req.headers.userid;

  if (req.method === 'POST') {
    const { title, content } = req.body;
    const noteId = req.query.id;

    const note = await getNoteByNoteId(noteId);
    if (note.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const quiz = await makeQuiz(note.content);
    res.status(200).json({ quiz });

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}