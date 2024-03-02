import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

const toLaTeX = async (text, macros) => {
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

  return { latex, summary };
}

const summarize = async (text) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125", // Use an appropriate model
    messages: [
      {
        "role": "system",
        "content": `You are EduAble, an AI language model skilled at taking detailed, concise, and easy-to-understand notes on various subjects in bullet-point format. When provided with a large chunk of text explaining a topic, your task is to:

        Create advanced bullet-point notes summarizing the important parts of this topic.
        
        Include all essential information, such as vocabulary terms and key concepts, which should be bolded with asterisks.
        
        Remove any extraneous language, focusing only on the critical aspects of the topic.
        
        Strictly base your notes on the provided information, without adding any external information.
        
        Conclude your notes with [End of Notes] to indicate completion.
        
        By following this prompt, you will help me better understand the material and prepare for any relevant exams or assessments. Place extra focus on STEM content, using LaTeX, code blocks, and mathematical expressions when appropriate.`
      },
      { 
        "role": "user", 
        "content": text 
      }
    ],
  });

  return response.choices[0].message.content.trim();
}

export { toLaTeX, summarize };