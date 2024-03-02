import { toLaTeX } from '@/utils/openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text, macros } = req.body;
      const { latex, summary } = await toLaTeX(text, macros);
      res.status(200).json({ latex, summary: summary.replace(/^"+/g, '').replace(/"+$/g, '') });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error processing LaTeX conversion' });
    }
  } else {
    // Handle any requests that aren't POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
