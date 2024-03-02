import { getNotesByUserId, createNote, updateNote, getSummaryByNoteId, getNoteByNoteId, createSummary } from '@/utils/db';
import { summarize } from '@/utils/openai';

export default async function handler(req, res) {
  const userId = req.headers.userid;

  if (req.method === 'POST') {
    const { title, content } = req.body;
    const noteId = req.query.id;

    const existingSummary = await getSummaryByNoteId(noteId);

    if (existingSummary) {
      return res.status(200).json({ summary: existingSummary.content });
    }

    const note = await getNoteByNoteId(noteId);
    if (note.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const summary = await summarize(note.content);
    await createSummary(noteId, summary);

    res.status(200).json({ summary });

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}