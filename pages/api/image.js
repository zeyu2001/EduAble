import { convertImage } from '@/utils/openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body;
      const { latex } = await convertImage(image);
      res.status(200).json({ latex });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error processing LaTeX conversion' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
