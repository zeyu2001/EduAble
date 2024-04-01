import { createNote } from '@/utils/db';

export default async function handler(req, res) {
  const userId = process.env.CUSTOM_GPT_USER_ID;
  const token = req.headers.authorization;
  if (!token.includes(process.env.CUSTOM_GPT_API_KEY)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (req.method === 'POST') {
    const { title, content } = req.body;
    const note = await createNote(userId, title, content);
    return res.status(200).json({ id: note });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}