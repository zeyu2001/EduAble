async function convertToLaTeX(text, macros) {
  const response = await fetch('/api/latex', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, macros }),
  });

  if (!response.ok) {
    throw new Error('Failed to convert text to LaTeX');
  }

  const data = await response.json();
  return { latex: data.latex, title: data.summary };
}

function parseLatex(text) {
  const latexPattern = /\$(.*?)\$/g;
  let parts = [];
  let lastIndex = 0;

  text.replace(latexPattern, (match, latex, index) => {
    // Push preceding text if there is any
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), isLatex: false });
    }
    // Push LaTeX text
    parts.push({ text: latex, isLatex: true });
    lastIndex = index + match.length;
  });

  // Push remaining text if there is any
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isLatex: false });
  }

  return parts;
}

export {
  convertToLaTeX,
  parseLatex
}