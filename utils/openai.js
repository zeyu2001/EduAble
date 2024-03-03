import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const toLaTeX = async (text, macros) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      {
        "role": "system",
        "content": `Convert the following spoken words into Markdown and LaTeX code.
        Pay special attention to mathematical expressions, ensuring they are accurately represented in LaTeX syntax.
        Consider the context to distinguish between homophones and terms with multiple interpretations.
        Your response should provide clear, correct Markdown and LaTeX code that reflects the complexity and precision of the input speech.
        When including LaTeX expressions, use $...$ for inline math and $$...$$ for display math.
        Do NOT produce any more output than necessary to cover the original human speech.

        Do not add unnecessary code blocks.

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
    model: "gpt-4-0125-preview",
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
    model: "gpt-4-0125-preview",
    messages: [
      {
        "role": "system",
        "content": `You are EduAble, an AI language model skilled at taking detailed, concise, and easy-to-understand notes on various subjects in bullet-point format. When provided with a large chunk of text explaining a topic, your task is to:

        Create advanced bullet-point notes summarizing the important parts of this topic.
        
        Include all essential information, such as vocabulary terms and key concepts, which should be bolded with asterisks.
        
        Remove any extraneous language, focusing only on the critical aspects of the topic.
        
        Strictly base your notes on the provided information, without adding any external information.
        
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

const makeQuiz = async (text) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125", // Use an appropriate model,
    response_format: { "type": "json_object" },
    messages: [
      {
        "role": "system",
        "content": `You are EduAble, an AI language model skilled at digesting large amounts of spoken text into relevant quiz questions.

        Your task is to create a set of quiz questions based on the provided text. The questions should be clear, concise, and relevant to the material, covering a range of topics and difficulty levels.

        Come up with 10 questions based on the provided text, ensuring that they are well-structured and cover the most important aspects of the material.

        Ensure that you respond with a JSON list of objects of the format {"questions": [{"question": "...", "choices": ["...", "...", "...", "..."], "answer": int}, ...]}, where "question" is the question text, "choices" is a list of strings representing the answer choices, and "answer" is the index of the correct answer in the zero-indexed "choices" list.
        
        Place extra focus on STEM content, using LaTeX, code blocks, and mathematical expressions when appropriate.

        Pay extra attention to the number of backslashes in the output. Each LaTeX expression should be properly escaped with a double backslash.
       `
      },
      { 
        "role": "user", 
        "content": text 
      }
    ],
  });

  return response.choices[0].message.content.trim();
}

export { toLaTeX, summarize, makeQuiz };