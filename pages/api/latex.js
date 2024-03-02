import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text, macros } = req.body;
      console.log('text:', text);
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125", // Use an appropriate model
        messages: [
          {
            "role": "system",
            "content": `Convert the following spoken words into Markdown and LaTeX code.
            Pay special attention to mathematical expressions, ensuring they are accurately represented in LaTeX syntax.
            Consider the context to distinguish between homophones and terms with multiple interpretations.
            Your response should provide clear, correct Markdown and LaTeX code that reflects the complexity and precision of the input speech.
            When including LaTeX expressions, use $...$ for inline math and $$...$$ for display math.
            Do NOT produce any more output than necessary to cover the original human speech.

            When encountering any of the following expressions, use the corresponding Markdown code:
            - "begin heading" → #
            - "begin subheading" → ##
            - "new line" → \n
            
            When encountering any of the following macros, convert the text to the corresponding LaTeX code:
            ${Object.entries(macros).map(([name, latex]) => `${name} → ${latex}`).join('\n')}`
          },
          { 
            "role": "user", 
            "content": text 
          }
        ],
      });

      const latex = response.choices[0].message.content.trim();

      const summaryResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125", // Use an appropriate model
        messages: [
          {
            "role": "system",
            "content": `Come up with a short title for the following note.
            
            ${latex}`
          },
        ],
      });

      const summary = summaryResponse.choices[0].message.content.trim();

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
