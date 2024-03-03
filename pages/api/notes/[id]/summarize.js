import { getNotesByUserId, createNote, updateNote, getSummaryByNoteId, getNoteByNoteId, createSummary, updateSummary } from '@/utils/db';
import { summarize } from '@/utils/openai';

export default async function handler(req, res) {
  const userId = req.headers.userid;

  if (req.method === 'POST') {
    const { title, content, regenerate } = req.body;
    const noteId = req.query.id;

    const existingSummary = await getSummaryByNoteId(noteId);

    if (existingSummary && !regenerate) {
      return res.status(200).json({ summary: existingSummary.content });
    }

    const note = await getNoteByNoteId(noteId);
    if (note.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const summary = await summarize(note.content);

    if (existingSummary) {
      await updateSummary(noteId, summary);
    } else {
      await createSummary(noteId, summary);
    }

    res.status(200).json({ summary });

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}