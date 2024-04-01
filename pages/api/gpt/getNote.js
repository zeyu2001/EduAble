import { getNoteByNoteId } from '@/utils/db';

export default async function handler(req, res) {
  const userId = process.env.CHATGPT_USER_ID;
  
  if (req.method === 'POST') {
    const { noteId } = req.body;
    const note = await getNoteByNoteId(noteId);
    return res.status(200).json(note);
  }
}